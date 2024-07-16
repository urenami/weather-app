from django.urls import path
from .views import CurrentWeather, WeatherList, WeatherForecast

urlpatterns = [
    path('weather/current/', CurrentWeather.as_view(), name='current-weather'),
    path('weather/forecast/', WeatherForecast.as_view(), name='weather-forecast'),
    path('weather/list/', WeatherList.as_view(), name='weather-list'),
]