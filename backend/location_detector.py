"""
Location Detection Service
Detects user location via IP address for personalized listings
"""

import requests
import logging
from typing import Dict, Optional
from dataclasses import dataclass

@dataclass
class UserLocation:
    city: str
    state: str
    country: str
    latitude: float
    longitude: float
    region: str
    confidence: str = "medium"

class LocationDetector:
    def __init__(self):
        self.ipapi_url = "http://ip-api.com/json/"
        self.ipinfo_url = "https://ipinfo.io/"
        
    def detect_location_from_ip(self, ip_address: str) -> Optional[UserLocation]:
        """Detect user location from IP address using multiple services"""
        
        # Try ip-api.com first (free, no key required)
        try:
            response = requests.get(f"{self.ipapi_url}{ip_address}", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success':
                    return UserLocation(
                        city=data.get('city', ''),
                        state=data.get('regionName', ''),
                        country=data.get('country', ''),
                        latitude=float(data.get('lat', 0)),
                        longitude=float(data.get('lon', 0)),
                        region=data.get('region', ''),
                        confidence="high"
                    )
        except Exception as e:
            logging.warning(f"ip-api.com failed: {e}")
        
        # Fallback to ipinfo.io
        try:
            response = requests.get(f"{self.ipinfo_url}{ip_address}/json", timeout=5)
            if response.status_code == 200:
                data = response.json()
                loc = data.get('loc', '0,0').split(',')
                return UserLocation(
                    city=data.get('city', ''),
                    state=data.get('region', ''),
                    country=data.get('country', ''),
                    latitude=float(loc[0]) if len(loc) > 0 else 0,
                    longitude=float(loc[1]) if len(loc) > 1 else 0,
                    region=data.get('region', ''),
                    confidence="medium"
                )
        except Exception as e:
            logging.warning(f"ipinfo.io failed: {e}")
        
        return None
    
    def get_nearby_states(self, state: str) -> list:
        """Get nearby states for expanded search"""
        state_neighbors = {
            'Arkansas': ['Louisiana', 'Texas', 'Oklahoma', 'Missouri', 'Tennessee', 'Mississippi'],
            'Texas': ['Oklahoma', 'Arkansas', 'Louisiana', 'New Mexico'],
            'Louisiana': ['Texas', 'Arkansas', 'Mississippi'],
            'Oklahoma': ['Texas', 'Arkansas', 'Kansas', 'Missouri'],
            'Missouri': ['Arkansas', 'Oklahoma', 'Kansas', 'Iowa', 'Illinois', 'Kentucky', 'Tennessee'],
            'Tennessee': ['Arkansas', 'Missouri', 'Kentucky', 'Virginia', 'North Carolina', 'Georgia', 'Alabama', 'Mississippi'],
            'Mississippi': ['Arkansas', 'Tennessee', 'Alabama', 'Louisiana'],
            'Alabama': ['Tennessee', 'Mississippi', 'Georgia', 'Florida'],
            'Georgia': ['Tennessee', 'Alabama', 'Florida', 'South Carolina', 'North Carolina'],
            'Florida': ['Alabama', 'Georgia'],
            'California': ['Nevada', 'Arizona', 'Oregon'],
            'Arizona': ['California', 'Nevada', 'Utah', 'Colorado', 'New Mexico'],
            'Nevada': ['California', 'Arizona', 'Utah', 'Idaho', 'Oregon'],
            'New York': ['New Jersey', 'Pennsylvania', 'Connecticut', 'Massachusetts', 'Vermont'],
            'Pennsylvania': ['New York', 'New Jersey', 'Delaware', 'Maryland', 'West Virginia', 'Ohio'],
            'Ohio': ['Pennsylvania', 'West Virginia', 'Kentucky', 'Indiana', 'Michigan'],
            'Illinois': ['Indiana', 'Iowa', 'Missouri', 'Kentucky', 'Wisconsin'],
            'Michigan': ['Ohio', 'Indiana', 'Illinois', 'Wisconsin'],
            'Wisconsin': ['Illinois', 'Michigan', 'Minnesota', 'Iowa'],
            'Minnesota': ['Wisconsin', 'Iowa', 'South Dakota', 'North Dakota'],
            'North Carolina': ['Tennessee', 'Georgia', 'South Carolina', 'Virginia'],
            'South Carolina': ['North Carolina', 'Georgia'],
            'Virginia': ['Tennessee', 'Kentucky', 'West Virginia', 'Maryland', 'Delaware', 'North Carolina'],
            'Maryland': ['Pennsylvania', 'Delaware', 'Virginia', 'West Virginia'],
            'Delaware': ['Pennsylvania', 'Maryland', 'New Jersey'],
            'New Jersey': ['New York', 'Pennsylvania', 'Delaware'],
            'Connecticut': ['New York', 'Massachusetts', 'Rhode Island'],
            'Massachusetts': ['New York', 'Vermont', 'New Hampshire', 'Rhode Island', 'Connecticut'],
            'Rhode Island': ['Massachusetts', 'Connecticut'],
            'Vermont': ['New York', 'Massachusetts', 'New Hampshire'],
            'New Hampshire': ['Massachusetts', 'Vermont', 'Maine'],
            'Maine': ['New Hampshire'],
            'Washington': ['Oregon', 'Idaho'],
            'Oregon': ['Washington', 'California', 'Nevada', 'Idaho'],
            'Idaho': ['Washington', 'Oregon', 'Nevada', 'Utah', 'Wyoming', 'Montana'],
            'Montana': ['Idaho', 'Wyoming', 'South Dakota', 'North Dakota'],
            'Wyoming': ['Montana', 'Idaho', 'Utah', 'Colorado', 'Nebraska', 'South Dakota'],
            'Colorado': ['Wyoming', 'Utah', 'Arizona', 'New Mexico', 'Oklahoma', 'Kansas', 'Nebraska'],
            'New Mexico': ['Colorado', 'Arizona', 'Texas', 'Oklahoma'],
            'Utah': ['Idaho', 'Wyoming', 'Colorado', 'Arizona', 'Nevada'],
            'Kansas': ['Colorado', 'Oklahoma', 'Missouri', 'Nebraska'],
            'Nebraska': ['Wyoming', 'Colorado', 'Kansas', 'Missouri', 'Iowa', 'South Dakota'],
            'Iowa': ['Nebraska', 'Missouri', 'Illinois', 'Wisconsin', 'Minnesota', 'South Dakota'],
            'South Dakota': ['Montana', 'Wyoming', 'Nebraska', 'Iowa', 'Minnesota', 'North Dakota'],
            'North Dakota': ['Montana', 'South Dakota', 'Minnesota'],
            'Kentucky': ['Missouri', 'Tennessee', 'Virginia', 'West Virginia', 'Ohio', 'Indiana', 'Illinois'],
            'Indiana': ['Illinois', 'Kentucky', 'Ohio', 'Michigan'],
            'West Virginia': ['Pennsylvania', 'Maryland', 'Virginia', 'Kentucky', 'Ohio']
        }
        
        return state_neighbors.get(state, [])
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points in miles"""
        import math
        
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 3956  # Radius of earth in miles
        
        return c * r
    
    def get_location_context(self, location: UserLocation) -> Dict:
        """Get contextual information about the user's location"""
        context = {
            'is_major_metro': False,
            'laundromat_market_type': 'suburban',  # urban, suburban, rural
            'nearby_states': self.get_nearby_states(location.state),
            'search_radius_miles': 50,
            'market_description': f"{location.city}, {location.state}"
        }
        
        # Major metro areas with higher laundromat density
        major_metros = [
            'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
            'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
            'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
            'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville',
            'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville',
            'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
            'Mesa', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs', 'Raleigh',
            'Miami', 'Virginia Beach', 'Omaha', 'Oakland', 'Minneapolis', 'Tulsa',
            'Arlington', 'New Orleans', 'Wichita'
        ]
        
        if location.city in major_metros:
            context['is_major_metro'] = True
            context['laundromat_market_type'] = 'urban'
            context['search_radius_miles'] = 25
        
        # Rural areas (smaller cities)
        if location.city and len(location.city) > 0:
            # This is a simple heuristic - could be improved
            population_indicators = ['ville', 'burg', 'town', 'city']
            if any(indicator in location.city.lower() for indicator in population_indicators):
                context['laundromat_market_type'] = 'rural'
                context['search_radius_miles'] = 100
        
        return context

# Global instance
location_detector = LocationDetector()