// Simple script to check product count in the database
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3005/shop-api');

const COUNT_PRODUCTS_QUERY = `
  query {
    search(input: { take: 1 }) {
      totalItems
    }
  }
`;

const GET_COLLECTIONS_QUERY = `
  query {
    collections {
      totalItems
      items {
        id
        name
        slug
        description
      }
    }
  }
`;

const GET_PRODUCTS_QUERY = `
  query {
    search(input: { take: 10 }) {
      totalItems
      items {
        productId
        productName
        slug
        priceWithTax {
          min
          max
        }
      }
    }
  }
`;

async function checkProducts() {
  try {
    console.log('🔍 Checking database content...\n');
    
    // Get total count
    const countData = await client.request(COUNT_PRODUCTS_QUERY);
    const totalProducts = countData.search.totalItems;
    
    // Get collections count
    const collectionsData = await client.request(GET_COLLECTIONS_QUERY);
    const totalCollections = collectionsData.collections.totalItems;
    
    console.log(`📊 Total Products in Database: ${totalProducts}`);
    console.log(`📚 Total Collections in Database: ${totalCollections}\n`);
    
    if (totalProducts > 0) {
      // Get sample products
      const productsData = await client.request(GET_PRODUCTS_QUERY);
      const products = productsData.search.items;
      
      console.log('📦 Sample Products:');
      console.log('==================');
      
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.productName}`);
        console.log(`   Slug: ${product.slug}`);
        console.log(`   Price: KES ${product.priceWithTax.min.toLocaleString()}`);
        console.log(`   ID: ${product.productId}\n`);
      });
      
      if (totalProducts > 10) {
        console.log(`... and ${totalProducts - 10} more products`);
      }
    } else {
      console.log('❌ No products found in database');
    }
    
    if (totalCollections > 0) {
      console.log('\n📚 Collections:');
      console.log('===============');
      collectionsData.collections.items.forEach((collection, index) => {
        console.log(`${index + 1}. ${collection.name}`);
        console.log(`   Slug: ${collection.slug}`);
        console.log(`   ID: ${collection.id}`);
        if (collection.description) {
          console.log(`   Description: ${collection.description.substring(0, 100)}...`);
        }
        console.log('');
      });
    } else {
      console.log('❌ No collections found in database');
    }
    
    if (totalProducts === 0 && totalCollections === 0) {
      console.log('💡 Your database is empty. You may need to:');
      console.log('   1. Add sample data through the Vendure admin panel');
      console.log('   2. Import products and collections');
      console.log('   3. Check if the database is properly seeded');
    }
    
  } catch (error) {
    console.error('❌ Error checking products:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend is running on port 3005');
    console.log('2. Check if the database is connected');
    console.log('3. Verify the GraphQL endpoint is accessible');
  }
}

checkProducts();
