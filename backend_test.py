import requests
import json
import unittest
import uuid
from datetime import datetime

# Base URL from frontend/.env
BASE_URL = "https://26fd3cbe-d3cf-4881-a325-12fb8ac9d8b9.preview.emergentagent.com/api"

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
        
        # Test data for translation
        self.test_translation = {
            "text": "Hello, how are you?",
            "source_lang": "en",
            "target_lang": "fr"
        }
        
        print(f"Testing API at: {BASE_URL}")
        print(f"Using event_id: {self.event_id}")
        print(f"Using restaurant_id: {self.restaurant_id}")
        print(f"Using product_id: {self.product_id}")
        print(f"Using post_id: {self.post_id}")
        print(f"Using user_id: {self.user_id}")

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
        response = requests.get(f"{BASE_URL}/events")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
    
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

if __name__ == "__main__":
    unittest.main()

if __name__ == "__main__":
    unittest.main()