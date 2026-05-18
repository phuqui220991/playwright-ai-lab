import { test, expect } from '../../fixtures/pom/test-options';
import articleData from '../../test-data/articleData.json';

test.describe('Verify Home Page And Bondar Academy Website', () => {
    // Use guest session for navigation tests
    test.use({ storageState: '.auth/userSession.json' });

    test(
        'Verify Successful Loading of Home Page',
        { tag: '@Smoke' },
        async ({ homePage }) => {
            await homePage.navigateToHomePageGuest();
        }
    );

    test(
        'Verify Link to Bondar Academy Website',
        { tag: '@Regression' },
        async ({ homePage }) => {
            await test.step('Navigate to Home Page', async () => {
                await homePage.navigateToHomePageGuest();
            });

            await test.step('Verify Link to Bondar Academy Website', async () => {
                await expect(homePage.bondarAcademyLink).toHaveAttribute(
                    'href',
                    'https://bondaracademy.com'
                );
            });
        }
    );
});

test.describe('Mock API Response', () => {
    // Use guest (logged-out) session for navigation tests
    test.use({ storageState: { cookies: [], origins: [] } });

    test(
        'Mock API Response',
        { tag: '@Regression' },
        async ({ page, homePage }) => {
            await page.route(
                `${process.env['API_URL']}api/articles?limit=10&offset=0`,
                async (route) => {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            articles: [],
                            articlesCount: 0,
                        }),
                    });
                }
            );

            await page.route(
                `${process.env['API_URL']}api/tags`,
                async (route) => {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            tags: articleData.create.article.tagList,
                        }),
                    });
                }
            );

            await homePage.navigateToHomePageGuest();

            await expect(homePage.noArticlesMessage).toBeVisible();

            for (const tag of articleData.create.article.tagList) {
                await expect(
                    page.locator('.tag-list').getByText(tag)
                ).toBeVisible();
            }
        }
    );
});