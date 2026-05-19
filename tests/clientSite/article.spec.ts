import { test, expect } from '../../fixtures/pom/test-options';
import { faker } from '@faker-js/faker';

test.describe('Verify Publish/Edit/Delete an Article', () => {
    const randomArticleTitle = faker.lorem.words(3);
    const randomArticleDescription = faker.lorem.sentence();
    const randomArticleBody = faker.lorem.paragraphs(2);
    const randomArticleTag = faker.lorem.word();
    let articleId: string;

    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePageUser();
    });

    test.afterAll(async ({ apiRequest }) => {
        await apiRequest({
            method: 'DELETE',
            url: `api/articles/${articleId}`,
            baseUrl: process.env['API_URL'],
            headers: process.env['ACCESS_TOKEN'],
        });
    });

    test(
        'Verify Publish/Edit/Delete an Article',
        { tag: '@Sanity' },
        async ({ navPage, articlePage, page }) => {
            await test.step('Verify Publish an Article', async () => {
                await navPage.newArticleButton.click();

                const postResponsePromise = page.waitForResponse(
                    (res) =>
                        res.url() ===
                            `${process.env['API_URL']}api/articles/` &&
                        res.request().method() === 'POST',
                );

                await articlePage.publishArticle(
                    randomArticleTitle,
                    randomArticleDescription,
                    randomArticleBody,
                    randomArticleTag,
                );

                const responseBody = await (await postResponsePromise).json();
                articleId = responseBody.article.slug;
            });

            await test.step('Verify Edit an Article', async () => {
                await articlePage.navigateToEditArticlePage();

                await expect(articlePage.articleTitleInput).toHaveValue(
                    randomArticleTitle,
                );

                await articlePage.editArticle(
                    `Updated ${randomArticleTitle}`,
                    `Updated ${randomArticleDescription}`,
                    `Updated ${randomArticleBody}`,
                );
            });

            await test.step('Verify Delete an Article', async () => {
                await articlePage.deleteArticle();
            });
        },
    );
});
