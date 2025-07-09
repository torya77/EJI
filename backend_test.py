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
        """Setup for tests - create test data"""
        # Test data for each entity type
        self.test_event = {
            "title": "Test Festival",
            "location": "Test Location, Algeria",
            "date": "2025-10-15",
            "time": "18:00",
            "price": 2000,
            "currency": "DZD",
            "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
            "description": "A test event for API testing",
            "coordinates": {"lat": 36.737232, "lng": 3.086472},
            "category": "Test"
        }
        
        self.test_restaurant = {
            "name": "Test Restaurant",
            "location": "Test Location, Algeria",
            "cuisine": "Test Cuisine",
            "price_range": "€€",
            "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
            "description": "A test restaurant for API testing",
            "coordinates": {"lat": 36.753768, "lng": 3.058756},
            "specialties": ["Test Dish 1", "Test Dish 2"],
            "hours": "12:00 - 23:00"
        }
        
        self.test_product = {
            "name": "Test Product",
            "price": 5000,
            "currency": "DZD",
            "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
            "description": "A test product for API testing",
            "category": "Test",
            "seller": "Test Seller",
            "location": "Test Location",
            "in_stock": True
        }
        
        self.test_post = {
            "author": "Test Author",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b9df4b92?w=50&h=50&fit=crop&crop=face",
            "content": "This is a test post for API testing",
            "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            "location": "Test Location, Algeria"
        }
        
        self.test_user = {
            "name": "Test User",
            "email": f"test{uuid.uuid4()}@example.com",  # Unique email to avoid conflicts
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
            "location": "Test Location, Algeria",
            "preferred_language": "fr"
        }
        
        self.test_translation = {
            "text": "Hello, how are you?",
            "source_lang": "en",
            "target_lang": "fr"
        }
        
        # Created entity IDs for cleanup
        self.created_ids = {
            "events": [],
            "restaurants": [],
            "products": [],
            "posts": [],
            "users": []
        }
        
        # Print the base URL for debugging
        print(f"Testing API at: {BASE_URL}")

    def tearDown(self):
        """Teardown for tests - clean up test data"""
        # Delete all created test entities
        for entity_type, ids in self.created_ids.items():
            for entity_id in ids:
                try:
                    requests.delete(f"{BASE_URL}/{entity_type}/{entity_id}")
                except Exception as e:
                    print(f"Error deleting {entity_type}/{entity_id}: {e}")

    # Helper method to print response for debugging
    def print_response(self, response):
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except:
            print(f"Response: {response.text}")

    # ===== Events API Tests =====
    
    def test_events_crud(self):
        """Test CRUD operations for Events API"""
        # Create event
        response = requests.post(f"{BASE_URL}/events", json=self.test_event)
        self.assertEqual(response.status_code, 200)
        event_data = response.json()
        self.assertIn("id", event_data)
        event_id = event_data["id"]
        self.created_ids["events"].append(event_id)
        
        # Get event by ID
        response = requests.get(f"{BASE_URL}/events/{event_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["title"], self.test_event["title"])
        
        # Update event
        update_data = {"title": "Updated Test Festival"}
        response = requests.put(f"{BASE_URL}/events/{event_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["title"], "Updated Test Festival")
        
        # Get all events
        response = requests.get(f"{BASE_URL}/events")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Delete event
        response = requests.delete(f"{BASE_URL}/events/{event_id}")
        self.assertEqual(response.status_code, 200)
        self.created_ids["events"].remove(event_id)
        
        # Verify deletion
        response = requests.get(f"{BASE_URL}/events/{event_id}")
        self.assertEqual(response.status_code, 404)
    
    def test_events_filters(self):
        """Test filtering and searching for Events API"""
        # Create test event
        response = requests.post(f"{BASE_URL}/events", json=self.test_event)
        self.assertEqual(response.status_code, 200)
        event_data = response.json()
        self.assertIn("id", event_data)
        event_id = event_data["id"]
        self.created_ids["events"].append(event_id)
        
        # Test category filter
        response = requests.get(f"{BASE_URL}/events?category={self.test_event['category']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test search
        response = requests.get(f"{BASE_URL}/events?search={self.test_event['title']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test sort
        response = requests.get(f"{BASE_URL}/events?sort_by=date")
        self.assertEqual(response.status_code, 200)
    
    def test_book_event(self):
        """Test booking an event"""
        # Create test event
        response = requests.post(f"{BASE_URL}/events", json=self.test_event)
        self.assertEqual(response.status_code, 200)
        event_data = response.json()
        self.assertIn("id", event_data)
        event_id = event_data["id"]
        self.created_ids["events"].append(event_id)
        
        # Book event
        response = requests.post(f"{BASE_URL}/events/{event_id}/book")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        
        # Verify attendees count increased
        response = requests.get(f"{BASE_URL}/events/{event_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["attendees"], 1)
    
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
    
    def test_restaurants_crud(self):
        """Test CRUD operations for Restaurants API"""
        # Create restaurant
        response = requests.post(f"{BASE_URL}/restaurants", json=self.test_restaurant)
        self.assertEqual(response.status_code, 200)
        restaurant_data = response.json()
        self.assertIn("id", restaurant_data)
        restaurant_id = restaurant_data["id"]
        self.created_ids["restaurants"].append(restaurant_id)
        
        # Get restaurant by ID
        response = requests.get(f"{BASE_URL}/restaurants/{restaurant_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], self.test_restaurant["name"])
        
        # Update restaurant
        update_data = {"name": "Updated Test Restaurant"}
        response = requests.put(f"{BASE_URL}/restaurants/{restaurant_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Updated Test Restaurant")
        
        # Get all restaurants
        response = requests.get(f"{BASE_URL}/restaurants")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Delete restaurant
        response = requests.delete(f"{BASE_URL}/restaurants/{restaurant_id}")
        self.assertEqual(response.status_code, 200)
        self.created_ids["restaurants"].remove(restaurant_id)
        
        # Verify deletion
        response = requests.get(f"{BASE_URL}/restaurants/{restaurant_id}")
        self.assertEqual(response.status_code, 404)
    
    def test_restaurants_filters(self):
        """Test filtering and searching for Restaurants API"""
        # Create test restaurant
        response = requests.post(f"{BASE_URL}/restaurants", json=self.test_restaurant)
        self.assertEqual(response.status_code, 200)
        restaurant_data = response.json()
        self.assertIn("id", restaurant_data)
        restaurant_id = restaurant_data["id"]
        self.created_ids["restaurants"].append(restaurant_id)
        
        # Test cuisine filter
        response = requests.get(f"{BASE_URL}/restaurants?cuisine={self.test_restaurant['cuisine']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test price_range filter
        response = requests.get(f"{BASE_URL}/restaurants?price_range={self.test_restaurant['price_range']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test search
        response = requests.get(f"{BASE_URL}/restaurants?search={self.test_restaurant['name']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test sort
        response = requests.get(f"{BASE_URL}/restaurants?sort_by=rating")
        self.assertEqual(response.status_code, 200)
    
    def test_reserve_table(self):
        """Test reserving a table at a restaurant"""
        # Create test restaurant
        response = requests.post(f"{BASE_URL}/restaurants", json=self.test_restaurant)
        self.assertEqual(response.status_code, 200)
        restaurant_data = response.json()
        self.assertIn("id", restaurant_data)
        restaurant_id = restaurant_data["id"]
        self.created_ids["restaurants"].append(restaurant_id)
        
        # Reserve table
        response = requests.post(f"{BASE_URL}/restaurants/{restaurant_id}/reserve")
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
    
    def test_products_crud(self):
        """Test CRUD operations for Products API"""
        # Create product
        response = requests.post(f"{BASE_URL}/products", json=self.test_product)
        self.assertEqual(response.status_code, 200)
        product_data = response.json()
        self.assertIn("id", product_data)
        product_id = product_data["id"]
        self.created_ids["products"].append(product_id)
        
        # Get product by ID
        response = requests.get(f"{BASE_URL}/products/{product_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], self.test_product["name"])
        
        # Update product
        update_data = {"name": "Updated Test Product"}
        response = requests.put(f"{BASE_URL}/products/{product_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Updated Test Product")
        
        # Get all products
        response = requests.get(f"{BASE_URL}/products")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Delete product
        response = requests.delete(f"{BASE_URL}/products/{product_id}")
        self.assertEqual(response.status_code, 200)
        self.created_ids["products"].remove(product_id)
        
        # Verify deletion
        response = requests.get(f"{BASE_URL}/products/{product_id}")
        self.assertEqual(response.status_code, 404)
    
    def test_products_filters(self):
        """Test filtering and searching for Products API"""
        # Create test product
        response = requests.post(f"{BASE_URL}/products", json=self.test_product)
        self.assertEqual(response.status_code, 200)
        product_data = response.json()
        self.assertIn("id", product_data)
        product_id = product_data["id"]
        self.created_ids["products"].append(product_id)
        
        # Test category filter
        response = requests.get(f"{BASE_URL}/products?category={self.test_product['category']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test search
        response = requests.get(f"{BASE_URL}/products?search={self.test_product['name']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
        
        # Test sort
        response = requests.get(f"{BASE_URL}/products?sort_by=price_low")
        self.assertEqual(response.status_code, 200)
    
    def test_purchase_product(self):
        """Test purchasing a product"""
        # Create test product
        response = requests.post(f"{BASE_URL}/products", json=self.test_product)
        self.assertEqual(response.status_code, 200)
        product_data = response.json()
        self.assertIn("id", product_data)
        product_id = product_data["id"]
        self.created_ids["products"].append(product_id)
        
        # Purchase product
        response = requests.post(f"{BASE_URL}/products/{product_id}/purchase")
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
    
    def test_posts_crud(self):
        """Test CRUD operations for Posts API"""
        # Create post
        response = requests.post(f"{BASE_URL}/posts", json=self.test_post)
        self.assertEqual(response.status_code, 200)
        post_data = response.json()
        self.assertIn("id", post_data)
        post_id = post_data["id"]
        self.created_ids["posts"].append(post_id)
        
        # Get post by ID
        response = requests.get(f"{BASE_URL}/posts/{post_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["content"], self.test_post["content"])
        
        # Update post
        update_data = {"content": "Updated test post content"}
        response = requests.put(f"{BASE_URL}/posts/{post_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["content"], "Updated test post content")
        
        # Get all posts
        response = requests.get(f"{BASE_URL}/posts")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Delete post
        response = requests.delete(f"{BASE_URL}/posts/{post_id}")
        self.assertEqual(response.status_code, 200)
        self.created_ids["posts"].remove(post_id)
        
        # Verify deletion
        response = requests.get(f"{BASE_URL}/posts/{post_id}")
        self.assertEqual(response.status_code, 404)
    
    def test_posts_filters(self):
        """Test filtering for Posts API"""
        # Create test post
        response = requests.post(f"{BASE_URL}/posts", json=self.test_post)
        self.assertEqual(response.status_code, 200)
        post_data = response.json()
        self.assertIn("id", post_data)
        post_id = post_data["id"]
        self.created_ids["posts"].append(post_id)
        
        # Test author filter
        response = requests.get(f"{BASE_URL}/posts?author={self.test_post['author']}")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)
    
    def test_like_unlike_post(self):
        """Test liking and unliking a post"""
        # Create test post
        response = requests.post(f"{BASE_URL}/posts", json=self.test_post)
        self.assertEqual(response.status_code, 200)
        post_data = response.json()
        self.assertIn("id", post_data)
        post_id = post_data["id"]
        self.created_ids["posts"].append(post_id)
        
        # Like post
        response = requests.post(f"{BASE_URL}/posts/{post_id}/like")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        
        # Verify likes count increased
        response = requests.get(f"{BASE_URL}/posts/{post_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["likes"], 1)
        
        # Unlike post
        response = requests.post(f"{BASE_URL}/posts/{post_id}/unlike")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        
        # Verify likes count decreased
        response = requests.get(f"{BASE_URL}/posts/{post_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["likes"], 0)
    
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
    
    def test_users_crud(self):
        """Test CRUD operations for Users API"""
        # Create user
        response = requests.post(f"{BASE_URL}/users", json=self.test_user)
        self.assertEqual(response.status_code, 200)
        user_data = response.json()
        self.assertIn("id", user_data)
        user_id = user_data["id"]
        self.created_ids["users"].append(user_id)
        
        # Get user by ID
        response = requests.get(f"{BASE_URL}/users/{user_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], self.test_user["name"])
        
        # Update user
        update_data = {"name": "Updated Test User"}
        response = requests.put(f"{BASE_URL}/users/{user_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Updated Test User")
        
        # Get all users
        response = requests.get(f"{BASE_URL}/users")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Delete user
        response = requests.delete(f"{BASE_URL}/users/{user_id}")
        self.assertEqual(response.status_code, 200)
        self.created_ids["users"].remove(user_id)
        
        # Verify deletion
        response = requests.get(f"{BASE_URL}/users/{user_id}")
        self.assertEqual(response.status_code, 404)
    
    def test_users_search(self):
        """Test searching for Users API"""
        # Create test user
        response = requests.post(f"{BASE_URL}/users", json=self.test_user)
        self.assertEqual(response.status_code, 200)
        user_data = response.json()
        self.assertIn("id", user_data)
        user_id = user_data["id"]
        self.created_ids["users"].append(user_id)
        
        # Test search
        response = requests.get(f"{BASE_URL}/users?search={self.test_user['name']}")
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