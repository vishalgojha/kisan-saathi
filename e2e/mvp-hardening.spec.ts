import { expect, test } from '@playwright/test';

const seedDashboardContext = async (page: import('@playwright/test').Page) => {
    await page.addInitScript(() => {
        const profile = [
            {
                id: 'e2e-profile-1',
                location: 'Indore',
                state: 'Madhya Pradesh',
                crops: ['Wheat', 'Rice', 'Soybean'],
                notification_preferences: {},
            },
        ];

        window.localStorage.setItem('kisan_saathi_is_authenticated', JSON.stringify(true));
        window.localStorage.setItem(
            'kisan_saathi_auth_user',
            JSON.stringify({
                id: 'e2e-user',
                role: 'farmer',
                name: 'E2E Farmer',
            })
        );
        window.localStorage.setItem('kisan_saathi_entity_FarmerProfile', JSON.stringify(profile));
        window.localStorage.setItem('kisanmitra_language', 'en');
        window.localStorage.setItem('kisan_saathi_data_mode', 'mock');
    });
};

test('AI chat happy path responds with advisory and links', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('kisanmitra_language', 'en');
        window.localStorage.setItem('kisan_saathi_data_mode', 'mock');
    });

    await page.goto('/aihelp');

    await page.getByTestId('ai-chat-input').fill('My crop has fungus spots and leaf damage.');
    await page.getByTestId('ai-chat-send').click();

    await expect(page.getByTestId('ai-chat-messages')).toContainText(/(रोग जांच|diagnosis)/i);
    await expect(page.locator('a[href*="#disease-diagnosis"]').first()).toBeVisible();
});

test('Disease diagnosis happy path returns result card', async ({ page }) => {
    await seedDashboardContext(page);
    await page.goto('/dashboard');

    await expect(page.getByTestId('dashboard-disease-diagnosis')).toBeVisible();
    await page.getByTestId('disease-symptoms-input').fill('Brown fungal spots across leaves');
    await page.getByTestId('disease-analyze').click();

    await expect(page.getByTestId('disease-result')).toContainText('Leaf Spot');
});

test('Market prices happy path loads trend rows', async ({ page }) => {
    await seedDashboardContext(page);
    await page.goto('/dashboard');

    await expect(page.getByTestId('dashboard-market-prices')).toBeVisible();
    await expect(page.getByTestId('market-today-rate')).toBeVisible();
    await expect(page.getByTestId('market-trend-row')).toHaveCount(7);

    await page.getByTestId('market-refresh').click();
    await expect(page.getByTestId('market-today-rate')).toBeVisible();
});
