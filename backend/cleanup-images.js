// Script to clean up products with base64 image data
import { sequelize } from './models/index.js';
import { Product } from './models/Product.js';

async function cleanupBase64Images() {
  try {
    const products = await Product.findAll();

    for (const product of products) {
      if (product.image && product.image.startsWith('data:')) {
        console.log(`Cleaning up product ${product.id} with base64 image`);
        // Set to placeholder image
        await product.update({ image: 'images/products/placeholder.jpg' });
      }
    }

    console.log('Cleanup completed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await sequelize.close();
  }
}

cleanupBase64Images();
