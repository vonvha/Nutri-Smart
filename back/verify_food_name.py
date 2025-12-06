import unittest
from unittest.mock import MagicMock, patch
import json
from services.gemini_service import analyze_image_nutrition

class TestFoodNameRecognition(unittest.TestCase):
    @patch('services.gemini_service.model')
    @patch('services.gemini_service.Image')
    def test_analyze_image_nutrition_returns_food_name(self, mock_image, mock_model):
        # Mock the Gemini response
        mock_response = MagicMock()
        mock_response.text = '```json\n{"food_name": "Manzana", "calories": 52, "protein": 0.3, "fat": 0.2}\n```'
        mock_model.generate_content.return_value = mock_response

        # Mock Image.open to avoid actual image processing
        mock_image.open.return_value = MagicMock()

        # Call the function with dummy bytes
        result = analyze_image_nutrition(b'dummy_image_bytes')

        # Verify the result
        self.assertTrue(result['is_food'])
        self.assertEqual(result['food_name'], 'Manzana')
        self.assertEqual(result['calories'], 52)
        self.assertEqual(result['protein'], 0.3)
        self.assertEqual(result['fat'], 0.2)

    @patch('services.gemini_service.model')
    @patch('services.gemini_service.Image')
    def test_analyze_image_nutrition_fallback_name(self, mock_image, mock_model):
        # Mock response without food_name
        mock_response = MagicMock()
        mock_response.text = '```json\n{"calories": 100, "protein": 10, "fat": 5}\n```'
        mock_model.generate_content.return_value = mock_response

        mock_image.open.return_value = MagicMock()

        result = analyze_image_nutrition(b'dummy_image_bytes')

        self.assertTrue(result['is_food'])
        self.assertEqual(result['food_name'], 'Comida escaneada')

if __name__ == '__main__':
    unittest.main()
