import requests
import json
import unittest
import uuid
from datetime import datetime

# Base URL from frontend/.env
BASE_URL = "https://fac0c436-f947-43bb-a81c-55027c60b773.preview.emergentagent.com/api"

class TestBackendAPI(unittest.TestCase):
    """Test suite for the EJI backend API"""

    def setUp(self):
        """Setup for tests - get existing data"""
        # Get existing entities for testing
        self.event_id = None
        self.restaurant_id = None
        self.product_id = None
        self.post_id = None
        self.user_id = None
        self.provider_id = None
        self.activity_id = None
        self.booking_id = None
        
        # Authentication tokens
        self.admin_token = "admin_token_123"
        self.provider_token = "provider_1_token"
        
        # Headers for authenticated requests
        self.admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        self.provider_headers = {"Authorization": f"Bearer {self.provider_token}"}
        
        # Get existing event
        response = requests.get(f"{BASE_URL}/events")
        if response.status_code == 200 and len(response.json()) > 0:
            self.event_id = response.json()[0]["id"]
            
        # Get existing restaurant
        response = requests.get(f"{BASE_URL}/restaurants")
        if response.status_code == 200 and len(response.json()) > 0:
            self.restaurant_id = response.json()[0]["id"]
            
        # Get existing product
        response = requests.get(f"{BASE_URL}/products")
        if response.status_code == 200 and len(response.json()) > 0:
            self.product_id = response.json()[0]["id"]
            
        # Get existing post
        response = requests.get(f"{BASE_URL}/posts")
        if response.status_code == 200 and len(response.json()) > 0:
            self.post_id = response.json()[0]["id"]
            
        # Get existing user
        response = requests.get(f"{BASE_URL}/users")
        if response.status_code == 200 and len(response.json()) > 0:
            self.user_id = response.json()[0]["id"]
            
        # Get existing provider
        response = requests.get(f"{BASE_URL}/admin/providers", headers=self.admin_headers)
        if response.status_code == 200 and len(response.json()) > 0:
            self.provider_id = response.json()[0]["id"]
            
        # Get existing activity
        response = requests.get(f"{BASE_URL}/admin/activities", headers=self.admin_headers)
        if response.status_code == 200 and len(response.json()) > 0:
            self.activity_id = response.json()[0]["id"]
            
        # Get existing booking
        if self.provider_id:
            response = requests.get(f"{BASE_URL}/providers/bookings", headers=self.provider_headers)
            if response.status_code == 200 and len(response.json()) > 0:
                self.booking_id = response.json()[0]["id"]
        
        # Test data for translation
        self.test_translation = {
            "text": "Hello, how are you?",
            "source_lang": "en",
            "target_lang": "fr"
        }
        
        # Test data for provider registration
        self.test_provider_registration = {
            "provider_type": "guide",
            "business_name": "Test Guide API",
            "owner_name": "Test Owner",
            "email": "testapi@example.com",
            "phone": "+213 555 123 456",
            "city": "Alger",
            "business_description": "Test description for API testing with minimum 100 characters required for validation purposes.",
            "specialties": ["Culture", "History"],
            "languages": ["French", "Arabic"],
            "quality_commitments": ["photos", "description", "certifications"],
            "charte_accepted": True,
            "commission_accepted": True,
            "understands_commission": True
        }
        
        # Test data for provider login
        self.test_provider_login = {
            "email": "ahmed.bensaid@gmail.com",
            "password": "password123"
        }
        
        # Test data for activity creation
        self.test_activity_creation = {
            "title": "Test Activity",
            "provider_id": "1",
            "type": "Guide Local",
            "location": "Alger",
            "price": 3500.0,
            "currency": "DZD",
            "category": "Culture",
            "duration": "3h",
            "max_participants": 8,
            "language": ["French", "Arabic"],
            "description": "Test activity description for API testing."
        }
        
        print(f"Testing API at: {BASE_URL}")
        print(f"Using event_id: {self.event_id}")
        print(f"Using restaurant_id: {self.restaurant_id}")
        print(f"Using product_id: {self.product_id}")
        print(f"Using post_id: {self.post_id}")
        print(f"Using user_id: {self.user_id}")
        print(f"Using provider_id: {self.provider_id}")
        print(f"Using activity_id: {self.activity_id}")
        print(f"Using booking_id: {self.booking_id}")

    # Helper method to print response for debugging
    def print_response(self, response):
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except:
            print(f"Response: {response.text}")

    # ===== Events API Tests =====
    
    def test_get_events(self):
        """Test getting all events"""
        print("Running test_get_events")
        response = requests.get(f"{BASE_URL}/events")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
        print("test_get_events passed")
    
    def test_get_event_by_id(self):
        """Test getting a single event by ID"""
        if not self.event_id:
            self.skipTest("No event ID available for testing")
        
        response = requests.get(f"{BASE_URL}/events/{self.event_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("title", response.json())
        self.assertIn("location", response.json())
    
    def test_events_filters(self):
        """Test filtering and searching for Events API"""
        # Get an event to use for filtering
        if not self.event_id:
            self.skipTest("No event ID available for testing")
            
        response = requests.get(f"{BASE_URL}/events/{self.event_id}")
        event = response.json()
        
        # Test category filter
        response = requests.get(f"{BASE_URL}/events?category={event['category']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test search
        response = requests.get(f"{BASE_URL}/events?search={event['title']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test sort
        response = requests.get(f"{BASE_URL}/events?sort_by=date")
        self.assertEqual(response.status_code, 200)
    
    def test_book_event(self):
        """Test booking an event"""
        if not self.event_id:
            self.skipTest("No event ID available for testing")
        
        # Get initial attendees count
        response = requests.get(f"{BASE_URL}/events/{self.event_id}")
        initial_attendees = response.json()["attendees"]
        
        # Book event
        response = requests.post(f"{BASE_URL}/events/{self.event_id}/book")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        
        # Verify attendees count increased
        response = requests.get(f"{BASE_URL}/events/{self.event_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["attendees"], initial_attendees + 1)
    
    def test_event_not_found(self):
        """Test error handling for non-existent event"""
        # Try to get non-existent event
        response = requests.get(f"{BASE_URL}/events/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to update non-existent event
        response = requests.put(f"{BASE_URL}/events/non-existent-id", json={"title": "Updated"})
        self.assertEqual(response.status_code, 404)
        
        # Try to delete non-existent event
        response = requests.delete(f"{BASE_URL}/events/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to book non-existent event
        response = requests.post(f"{BASE_URL}/events/non-existent-id/book")
        self.assertEqual(response.status_code, 404)

    # ===== Restaurants API Tests =====
    
    def test_get_restaurants(self):
        """Test getting all restaurants"""
        response = requests.get(f"{BASE_URL}/restaurants")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
    
    def test_get_restaurant_by_id(self):
        """Test getting a single restaurant by ID"""
        if not self.restaurant_id:
            self.skipTest("No restaurant ID available for testing")
        
        response = requests.get(f"{BASE_URL}/restaurants/{self.restaurant_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json())
        self.assertIn("location", response.json())
    
    def test_restaurants_filters(self):
        """Test filtering and searching for Restaurants API"""
        # Get a restaurant to use for filtering
        if not self.restaurant_id:
            self.skipTest("No restaurant ID available for testing")
            
        response = requests.get(f"{BASE_URL}/restaurants/{self.restaurant_id}")
        restaurant = response.json()
        
        # Test cuisine filter
        response = requests.get(f"{BASE_URL}/restaurants?cuisine={restaurant['cuisine']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test price_range filter
        response = requests.get(f"{BASE_URL}/restaurants?price_range={restaurant['price_range']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test search
        response = requests.get(f"{BASE_URL}/restaurants?search={restaurant['name']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test sort
        response = requests.get(f"{BASE_URL}/restaurants?sort_by=rating")
        self.assertEqual(response.status_code, 200)
    
    def test_reserve_table(self):
        """Test reserving a table at a restaurant"""
        if not self.restaurant_id:
            self.skipTest("No restaurant ID available for testing")
        
        # Reserve table
        response = requests.post(f"{BASE_URL}/restaurants/{self.restaurant_id}/reserve")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
    
    def test_restaurant_not_found(self):
        """Test error handling for non-existent restaurant"""
        # Try to get non-existent restaurant
        response = requests.get(f"{BASE_URL}/restaurants/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to update non-existent restaurant
        response = requests.put(f"{BASE_URL}/restaurants/non-existent-id", json={"name": "Updated"})
        self.assertEqual(response.status_code, 404)
        
        # Try to delete non-existent restaurant
        response = requests.delete(f"{BASE_URL}/restaurants/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to reserve table at non-existent restaurant
        response = requests.post(f"{BASE_URL}/restaurants/non-existent-id/reserve")
        self.assertEqual(response.status_code, 404)

    # ===== Products API Tests =====
    
    def test_get_products(self):
        """Test getting all products"""
        response = requests.get(f"{BASE_URL}/products")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
    
    def test_get_product_by_id(self):
        """Test getting a single product by ID"""
        if not self.product_id:
            self.skipTest("No product ID available for testing")
        
        response = requests.get(f"{BASE_URL}/products/{self.product_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json())
        self.assertIn("price", response.json())
    
    def test_products_filters(self):
        """Test filtering and searching for Products API"""
        # Get a product to use for filtering
        if not self.product_id:
            self.skipTest("No product ID available for testing")
            
        response = requests.get(f"{BASE_URL}/products/{self.product_id}")
        product = response.json()
        
        # Test category filter
        response = requests.get(f"{BASE_URL}/products?category={product['category']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test search
        response = requests.get(f"{BASE_URL}/products?search={product['name']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test sort
        response = requests.get(f"{BASE_URL}/products?sort_by=price_low")
        self.assertEqual(response.status_code, 200)
    
    def test_purchase_product(self):
        """Test purchasing a product"""
        if not self.product_id:
            self.skipTest("No product ID available for testing")
        
        # Purchase product
        response = requests.post(f"{BASE_URL}/products/{self.product_id}/purchase")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
    
    def test_product_not_found(self):
        """Test error handling for non-existent product"""
        # Try to get non-existent product
        response = requests.get(f"{BASE_URL}/products/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to update non-existent product
        response = requests.put(f"{BASE_URL}/products/non-existent-id", json={"name": "Updated"})
        self.assertEqual(response.status_code, 404)
        
        # Try to delete non-existent product
        response = requests.delete(f"{BASE_URL}/products/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to purchase non-existent product
        response = requests.post(f"{BASE_URL}/products/non-existent-id/purchase")
        self.assertEqual(response.status_code, 404)

    # ===== Posts API Tests =====
    
    def test_get_posts(self):
        """Test getting all posts"""
        response = requests.get(f"{BASE_URL}/posts")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
    
    def test_get_post_by_id(self):
        """Test getting a single post by ID"""
        if not self.post_id:
            self.skipTest("No post ID available for testing")
        
        response = requests.get(f"{BASE_URL}/posts/{self.post_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("author", response.json())
        self.assertIn("content", response.json())
    
    def test_posts_filters(self):
        """Test filtering for Posts API"""
        # Get a post to use for filtering
        if not self.post_id:
            self.skipTest("No post ID available for testing")
            
        response = requests.get(f"{BASE_URL}/posts/{self.post_id}")
        post = response.json()
        
        # Test author filter
        response = requests.get(f"{BASE_URL}/posts?author={post['author']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
    
    def test_like_unlike_post(self):
        """Test liking and unliking a post"""
        if not self.post_id:
            self.skipTest("No post ID available for testing")
        
        # Get initial likes count
        response = requests.get(f"{BASE_URL}/posts/{self.post_id}")
        initial_likes = response.json()["likes"]
        
        # Like post
        response = requests.post(f"{BASE_URL}/posts/{self.post_id}/like")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        
        # Verify likes count increased
        response = requests.get(f"{BASE_URL}/posts/{self.post_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["likes"], initial_likes + 1)
        
        # Unlike post
        response = requests.post(f"{BASE_URL}/posts/{self.post_id}/unlike")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        
        # Verify likes count decreased
        response = requests.get(f"{BASE_URL}/posts/{self.post_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["likes"], initial_likes)
    
    def test_post_not_found(self):
        """Test error handling for non-existent post"""
        # Try to get non-existent post
        response = requests.get(f"{BASE_URL}/posts/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to update non-existent post
        response = requests.put(f"{BASE_URL}/posts/non-existent-id", json={"content": "Updated"})
        self.assertEqual(response.status_code, 404)
        
        # Try to delete non-existent post
        response = requests.delete(f"{BASE_URL}/posts/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to like non-existent post
        response = requests.post(f"{BASE_URL}/posts/non-existent-id/like")
        self.assertEqual(response.status_code, 404)
        
        # Try to unlike non-existent post
        response = requests.post(f"{BASE_URL}/posts/non-existent-id/unlike")
        self.assertEqual(response.status_code, 404)

    # ===== Users API Tests =====
    
    def test_get_users(self):
        """Test getting all users"""
        response = requests.get(f"{BASE_URL}/users")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
    
    def test_get_user_by_id(self):
        """Test getting a single user by ID"""
        if not self.user_id:
            self.skipTest("No user ID available for testing")
        
        response = requests.get(f"{BASE_URL}/users/{self.user_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json())
        self.assertIn("email", response.json())
    
    def test_users_search(self):
        """Test searching for Users API"""
        # Get a user to use for searching
        if not self.user_id:
            self.skipTest("No user ID available for testing")
            
        response = requests.get(f"{BASE_URL}/users/{self.user_id}")
        user = response.json()
        
        # Test search
        response = requests.get(f"{BASE_URL}/users?search={user['name']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
    
    def test_user_not_found(self):
        """Test error handling for non-existent user"""
        # Try to get non-existent user
        response = requests.get(f"{BASE_URL}/users/non-existent-id")
        self.assertEqual(response.status_code, 404)
        
        # Try to update non-existent user
        response = requests.put(f"{BASE_URL}/users/non-existent-id", json={"name": "Updated"})
        self.assertEqual(response.status_code, 404)
        
        # Try to delete non-existent user
        response = requests.delete(f"{BASE_URL}/users/non-existent-id")
        self.assertEqual(response.status_code, 404)

    # ===== Translation API Tests =====
    
    def test_get_languages(self):
        """Test getting supported languages"""
        response = requests.get(f"{BASE_URL}/translate/languages")
        self.assertEqual(response.status_code, 200)
        self.assertIn("languages", response.json())
        self.assertIsInstance(response.json()["languages"], dict)
    
    def test_translate_text(self):
        """Test translating text"""
        response = requests.post(f"{BASE_URL}/translate/text", json=self.test_translation)
        self.assertEqual(response.status_code, 200)
        self.assertIn("translated_text", response.json())
        self.assertIn("original_text", response.json())
        self.assertEqual(response.json()["original_text"], self.test_translation["text"])
        self.assertEqual(response.json()["source_lang"], self.test_translation["source_lang"])
        self.assertEqual(response.json()["target_lang"], self.test_translation["target_lang"])
    
    def test_translate_conversation(self):
        """Test translating a conversation"""
        conversation = [self.test_translation, self.test_translation]
        response = requests.post(f"{BASE_URL}/translate/conversation", json=conversation)
        self.assertEqual(response.status_code, 200)
        self.assertIn("translations", response.json())
        self.assertIsInstance(response.json()["translations"], list)
        self.assertEqual(len(response.json()["translations"]), len(conversation))

    # ===== Admin API Tests =====
    
    def test_admin_authentication(self):
        """Test admin authentication"""
        # Test with valid token
        response = requests.get(f"{BASE_URL}/admin/stats", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        
        # Test with invalid token
        invalid_headers = {"Authorization": "Bearer invalid_token"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=invalid_headers)
        self.assertEqual(response.status_code, 403)  # API returns 403 for invalid tokens
        
        # Test without token
        response = requests.get(f"{BASE_URL}/admin/stats")
        self.assertEqual(response.status_code, 403)  # API returns 403 when no token is provided
    
    def test_get_admin_stats(self):
        """Test getting admin statistics"""
        response = requests.get(f"{BASE_URL}/admin/stats", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_providers", response.json())
        self.assertIn("active_providers", response.json())
        self.assertIn("pending_providers", response.json())
        self.assertIn("suspended_providers", response.json())
        self.assertIn("total_activities", response.json())
        self.assertIn("active_activities", response.json())
        self.assertIn("pending_activities", response.json())
        self.assertIn("rejected_activities", response.json())
        self.assertIn("total_bookings", response.json())
        self.assertIn("total_revenue", response.json())
        self.assertIn("monthly_growth", response.json())
    
    def test_get_admin_providers(self):
        """Test getting all providers as admin"""
        response = requests.get(f"{BASE_URL}/admin/providers", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
        
        # Test with status filter
        response = requests.get(f"{BASE_URL}/admin/providers?status=pending", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        for provider in response.json():
            self.assertEqual(provider["status"], "pending")
        
        # Test with provider_type filter
        response = requests.get(f"{BASE_URL}/admin/providers?provider_type=guide", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        for provider in response.json():
            self.assertEqual(provider["provider_type"], "guide")
        
        # Test with city filter
        response = requests.get(f"{BASE_URL}/admin/providers?city=Alger", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        for provider in response.json():
            self.assertEqual(provider["city"], "Alger")
    
    def test_get_admin_provider_by_id(self):
        """Test getting a specific provider as admin"""
        if not self.provider_id:
            self.skipTest("No provider ID available for testing")
        
        response = requests.get(f"{BASE_URL}/admin/providers/{self.provider_id}", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], self.provider_id)
        self.assertIn("business_name", response.json())
        self.assertIn("email", response.json())
        self.assertIn("status", response.json())
    
    def test_update_provider_status(self):
        """Test updating provider status as admin"""
        if not self.provider_id:
            self.skipTest("No provider ID available for testing")
        
        # Get current status
        response = requests.get(f"{BASE_URL}/admin/providers/{self.provider_id}", headers=self.admin_headers)
        current_status = response.json()["status"]
        
        # Update status to a different value
        new_status = "active" if current_status != "active" else "suspended"
        response = requests.put(
            f"{BASE_URL}/admin/providers/{self.provider_id}/status?status={new_status}",
            headers=self.admin_headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertEqual(response.json()["provider_id"], self.provider_id)
        
        # Verify status was updated
        response = requests.get(f"{BASE_URL}/admin/providers/{self.provider_id}", headers=self.admin_headers)
        self.assertEqual(response.json()["status"], new_status)
        
        # Reset status to original value
        response = requests.put(
            f"{BASE_URL}/admin/providers/{self.provider_id}/status?status={current_status}",
            headers=self.admin_headers
        )
        self.assertEqual(response.status_code, 200)
    
    def test_delete_provider(self):
        """Test deleting a provider as admin"""
        # Register a new provider to delete
        response = requests.post(f"{BASE_URL}/providers/register", json=self.test_provider_registration)
        self.assertEqual(response.status_code, 200)
        new_provider_id = response.json()["provider_id"]
        
        # Delete the provider
        response = requests.delete(f"{BASE_URL}/admin/providers/{new_provider_id}", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertEqual(response.json()["provider_id"], new_provider_id)
        
        # Verify provider was deleted
        response = requests.get(f"{BASE_URL}/admin/providers/{new_provider_id}", headers=self.admin_headers)
        self.assertEqual(response.status_code, 404)
    
    def test_get_admin_activities(self):
        """Test getting all activities as admin"""
        response = requests.get(f"{BASE_URL}/admin/activities", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
        
        # Test with status filter
        response = requests.get(f"{BASE_URL}/admin/activities?status=pending_validation", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        for activity in response.json():
            self.assertEqual(activity["status"], "pending_validation")
        
        # Test with provider_id filter
        if self.provider_id:
            response = requests.get(f"{BASE_URL}/admin/activities?provider_id={self.provider_id}", headers=self.admin_headers)
            self.assertEqual(response.status_code, 200)
            for activity in response.json():
                self.assertEqual(activity["provider_id"], self.provider_id)
        
        # Test with category filter
        response = requests.get(f"{BASE_URL}/admin/activities?category=Culture", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        for activity in response.json():
            self.assertEqual(activity["category"], "Culture")
    
    def test_update_activity_status(self):
        """Test updating activity status as admin"""
        if not self.activity_id:
            self.skipTest("No activity ID available for testing")
        
        # Get current status
        response = requests.get(f"{BASE_URL}/admin/activities/{self.activity_id}", headers=self.admin_headers)
        current_status = response.json()["status"]
        
        # Update status to a different value
        new_status = "active" if current_status != "active" else "suspended"
        response = requests.put(
            f"{BASE_URL}/admin/activities/{self.activity_id}/status?status={new_status}",
            headers=self.admin_headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertEqual(response.json()["activity_id"], self.activity_id)
        
        # Verify status was updated
        response = requests.get(f"{BASE_URL}/admin/activities/{self.activity_id}", headers=self.admin_headers)
        self.assertEqual(response.json()["status"], new_status)
        
        # Reset status to original value
        response = requests.put(
            f"{BASE_URL}/admin/activities/{self.activity_id}/status?status={current_status}",
            headers=self.admin_headers
        )
        self.assertEqual(response.status_code, 200)
    
    def test_create_activity_as_admin(self):
        """Test creating a new activity as admin"""
        response = requests.post(
            f"{BASE_URL}/admin/activities",
            json=self.test_activity_creation,
            headers=self.admin_headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json())
        self.assertEqual(response.json()["title"], self.test_activity_creation["title"])
        self.assertEqual(response.json()["provider_id"], self.test_activity_creation["provider_id"])
        self.assertEqual(response.json()["status"], "pending_validation")
        
        # Verify activity was created
        new_activity_id = response.json()["id"]
        response = requests.get(f"{BASE_URL}/admin/activities/{new_activity_id}", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], new_activity_id)
    
    # ===== Provider API Tests =====
    
    def test_provider_registration(self):
        """Test provider registration"""
        # Generate unique email to avoid conflicts
        unique_email = f"test{uuid.uuid4()}@example.com"
        registration_data = self.test_provider_registration.copy()
        registration_data["email"] = unique_email
        
        response = requests.post(f"{BASE_URL}/providers/register", json=registration_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertIn("provider_id", response.json())
        self.assertEqual(response.json()["status"], "pending")
        
        # Verify provider was created
        provider_id = response.json()["provider_id"]
        response = requests.get(f"{BASE_URL}/admin/providers/{provider_id}", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], unique_email)
        self.assertEqual(response.json()["status"], "pending")
    
    def test_provider_login(self):
        """Test provider login"""
        response = requests.post(f"{BASE_URL}/providers/login", json=self.test_provider_login)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())
        self.assertIn("provider_id", response.json())
        self.assertIn("business_name", response.json())
        self.assertIn("status", response.json())
    
    def test_provider_authentication(self):
        """Test provider authentication"""
        # Test with valid token
        response = requests.get(f"{BASE_URL}/providers/me", headers=self.provider_headers)
        self.assertEqual(response.status_code, 200)
        
        # Test with invalid token
        invalid_headers = {"Authorization": "Bearer invalid_token"}
        response = requests.get(f"{BASE_URL}/providers/me", headers=invalid_headers)
        self.assertEqual(response.status_code, 403)  # API returns 403 for invalid tokens
        
        # Test without token
        response = requests.get(f"{BASE_URL}/providers/me")
        self.assertEqual(response.status_code, 403)  # API returns 403 when no token is provided
    
    def test_get_provider_profile(self):
        """Test getting provider profile"""
        response = requests.get(f"{BASE_URL}/providers/me", headers=self.provider_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("business_name", response.json())
        self.assertIn("email", response.json())
        self.assertIn("status", response.json())
    
    def test_update_provider_profile(self):
        """Test updating provider profile"""
        # Get current profile
        response = requests.get(f"{BASE_URL}/providers/me", headers=self.provider_headers)
        current_profile = response.json()
        
        # Update profile
        update_data = {
            "business_description": f"Updated description {uuid.uuid4()}"
        }
        response = requests.put(f"{BASE_URL}/providers/me", json=update_data, headers=self.provider_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertIn("provider", response.json())
        
        # Verify profile was updated
        response = requests.get(f"{BASE_URL}/providers/me", headers=self.provider_headers)
        self.assertEqual(response.json()["business_description"], update_data["business_description"])
    
    def test_get_provider_dashboard_stats(self):
        """Test getting provider dashboard statistics"""
        response = requests.get(f"{BASE_URL}/providers/dashboard/stats", headers=self.provider_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_activities", response.json())
        self.assertIn("active_activities", response.json())
        self.assertIn("pending_activities", response.json())
        self.assertIn("total_bookings", response.json())
        self.assertIn("total_revenue", response.json())
        self.assertIn("monthly_revenue", response.json())
        self.assertIn("rating", response.json())
        self.assertIn("total_reviews", response.json())
        self.assertIn("commission_rate", response.json())
        self.assertIn("this_month_earnings", response.json())
    
    def test_get_provider_activities(self):
        """Test getting provider activities"""
        response = requests.get(f"{BASE_URL}/providers/activities", headers=self.provider_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
    
    def test_create_provider_activity(self):
        """Test creating a new activity as provider"""
        # Create activity data
        activity_data = {
            "title": f"Test Activity {uuid.uuid4()}",
            "location": "Alger",
            "price": 3500.0,
            "currency": "DZD",
            "category": "Culture",
            "duration": "3h",
            "max_participants": 8,
            "language": ["French", "Arabic"],
            "description": "Test activity description for API testing.",
            "images": [],
            "available_dates": ["2025-08-01", "2025-08-02"]
        }
        
        response = requests.post(
            f"{BASE_URL}/providers/activities",
            json=activity_data,
            headers=self.provider_headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertIn("activity", response.json())
        self.assertEqual(response.json()["activity"]["title"], activity_data["title"])
        self.assertEqual(response.json()["activity"]["status"], "pending_validation")
    
    def test_get_provider_bookings(self):
        """Test getting provider bookings"""
        response = requests.get(f"{BASE_URL}/providers/bookings", headers=self.provider_headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Test with status filter
        response = requests.get(f"{BASE_URL}/providers/bookings?status=confirmed", headers=self.provider_headers)
        self.assertEqual(response.status_code, 200)
        for booking in response.json():
            self.assertEqual(booking["status"], "confirmed")
    
    def test_update_booking_status(self):
        """Test updating booking status"""
        if not self.booking_id:
            self.skipTest("No booking ID available for testing")
        
        # Get current status
        response = requests.get(f"{BASE_URL}/providers/bookings", headers=self.provider_headers)
        booking = next((b for b in response.json() if b["id"] == self.booking_id), None)
        if not booking:
            self.skipTest("Booking not found")
        
        current_status = booking["status"]
        
        # Update status to a different value
        new_status = "completed" if current_status != "completed" else "confirmed"
        response = requests.put(
            f"{BASE_URL}/providers/bookings/{self.booking_id}/status?status={new_status}",
            headers=self.provider_headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertEqual(response.json()["booking_id"], self.booking_id)
        
        # Verify status was updated
        response = requests.get(f"{BASE_URL}/providers/bookings", headers=self.provider_headers)
        booking = next((b for b in response.json() if b["id"] == self.booking_id), None)
        self.assertEqual(booking["status"], new_status)
        
        # Reset status to original value
        response = requests.put(
            f"{BASE_URL}/providers/bookings/{self.booking_id}/status?status={current_status}",
            headers=self.provider_headers
        )
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()