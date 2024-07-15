from django.urls import path
from .views import CurrentWeather, WeatherList

urlpatterns = [
    path('weather/current/', CurrentWeather.as_view(), name='current-weather'),
    path('weather/list/', WeatherList.as_view(), name='weather-list'),
]
