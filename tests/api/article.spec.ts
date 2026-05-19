import { ArticleResponseSchema } from '../../fixtures/api/schemas';
import { ArticleResponse } from '../../fixtures/api/types-guards';
import { test, expect } from '../../fixtures/pom/test-options';
import articleData from '../../test-data/articleData.json';
import { HTTP_METHOD } from '@utils/constants';

test.describe('Verify CRUD for Article', () => {
    test(
        'Verify Create/Read/Update/Delete an Article',
        { tag: '@Api' },
        async ({ apiRequest }) => {
            let articleId: string;

            await test.step('Verify Create an Article', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: HTTP_METHOD.POST,
                    url: 'api/articles/',
                    baseUrl: process.env['API_URL'],
                    body: articleData.create,
                    headers: process.env['ACCESS_TOKEN'],
                });
                expect(status).toBe(201);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
                articleId = body.article.slug;
            });

            await test.step('Verify Read an Article', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: HTTP_METHOD.GET,
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env['API_URL'],
                });

                expect(status).toBe(200);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
            });

            await test.step('Verify Update an Article', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: HTTP_METHOD.PUT,
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env['API_URL'],
                    body: articleData.update,
                    headers: process.env['ACCESS_TOKEN'],
                });

                expect(status).toBe(200);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
                expect(body.article.title).toBe(
                    articleData.update.article.title,
                );
                articleId = body.article.slug;
            });

            await test.step('Verify Read an Article', async () => {
                const { status, body } = await apiRequest<ArticleResponse>({
                    method: HTTP_METHOD.GET,
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env['API_URL'],
                });

                expect(status).toBe(200);
                expect(ArticleResponseSchema.parse(body)).toBeTruthy();
                expect(body.article.title).toBe(
                    articleData.update.article.title,
                );
            });

            await test.step('Verify Delete an Article', async () => {
                const { status } = await apiRequest({
                    method: HTTP_METHOD.DELETE,
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env['API_URL'],
                    headers: process.env['ACCESS_TOKEN'],
                });

                expect(status).toBe(204);
            });

            await test.step('Verify the Article is deleted', async () => {
                const { status } = await apiRequest({
                    method: HTTP_METHOD.GET,
                    url: `api/articles/${articleId}`,
                    baseUrl: process.env['API_URL'],
                });

                expect(status).toBe(404);
            });
        },
    );
});
