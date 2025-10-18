import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import { createConnection } from 'typeorm';

async function initTaxSettings() {
    const app = await bootstrap(config);
    const connection = app.get(createConnection);
    const ctx = await app.get('RequestContext');

    try {
        // Create a Zone
        const zone = await ctx.app.service('zoneService').create({
            name: 'Default Zone',
            members: ['US']  // Add your country code here
        });

        // Create a TaxCategory
        const taxCategory = await ctx.app.service('taxCategoryService').create({
            name: 'Standard Tax',
        });

        // Create a TaxRate
        await ctx.app.service('taxRateService').create({
            name: 'Standard Tax Rate',
            value: 20,  // 20% tax rate
            enabled: true,
            zoneId: zone.id,
            categoryId: taxCategory.id,
        });

        console.log('Successfully initialized tax settings!');
    } catch (error) {
        console.error('Error initializing tax settings:', error);
    } finally {
        await app.close();
    }
}

initTaxSettings().catch(err => {
    console.error(err);
    process.exit(1);
});