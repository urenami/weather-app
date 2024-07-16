from collections import defaultdict
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Weather
from django.conf import settings

class CurrentWeather(APIView):
    def get(self, request):
        city = request.GET.get('city')
        api_key = settings.OPENWEATHERMAP_API_KEY
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={api_key}'
        
        try:
            response = requests.get(url)
            data = response.json()
            
            if response.status_code == 200:
                weather_data = {
                    'city': data['name'],
                    'temperature': data['main']['temp'],
                    'humidity': data['main']['humidity'],
                    'description': data['weather'][0]['description'],
                }
                
                Weather.objects.create(
                    city=weather_data['city'],
                    temperature=weather_data['temperature'],
                    humidity=weather_data['humidity'],
                    description=weather_data['description']
                )
                
                return Response(weather_data, status=status.HTTP_200_OK)
            else:
                return Response(data, status=response.status_code)
        
        except requests.exceptions.RequestException as e:
            return Response({'error': 'Failed to connect to OpenWeatherMap API', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError as e:
            return Response({'error': 'Invalid response from OpenWeatherMap API', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class WeatherForecast(APIView):
    def get(self, request):
        city = request.GET.get('city')
        api_key = settings.OPENWEATHERMAP_API_KEY
        url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&appid={api_key}'
        
        try:
            response = requests.get(url)
            data = response.json()
            
            if response.status_code == 200:
                forecast_data = defaultdict(list)
                for forecast in data['list']:
                    date = forecast['dt_txt'].split(' ')[0]
                    forecast_data[date].append({
                        'time': forecast['dt_txt'].split(' ')[1],
                        'temperature': forecast['main']['temp'],
                        'humidity': forecast['main']['humidity'],
                        'description': forecast['weather'][0]['description'],
                    })
                
                formatted_forecast = [{'date': date, 'forecasts': forecasts} for date, forecasts in forecast_data.items()]
                
                return Response(formatted_forecast, status=status.HTTP_200_OK)
            else:
                return Response(data, status=response.status_code)
        
        except requests.exceptions.RequestException as e:
            return Response({'error': 'Failed to connect to OpenWeatherMap API', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError as e:
            return Response({'error': 'Invalid response from OpenWeatherMap API', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class WeatherList(APIView):
    def get(self, request):
        weather_entries = Weather.objects.all()
        data = [{
            'city': entry.city,
            'temperature': entry.temperature,
            'humidity': entry.humidity,
            'description': entry.description,
        } for entry in weather_entries]
        return Response(data, status=status.HTTP_200_OK)
