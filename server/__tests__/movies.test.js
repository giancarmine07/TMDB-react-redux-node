const request = require('supertest');
const app = require('../src/server');

describe('Movies API', () => {
  describe('GET /api/movies/popular', () => {
    it('should get popular movies', async () => {
      const res = await request(app)
        .get('/api/movies/popular')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.results).toBeDefined();
      expect(Array.isArray(res.body.data.results)).toBe(true);
    });
  });

  describe('GET /api/movies/search', () => {
    it('should search movies by query', async () => {
      const res = await request(app)
        .get('/api/movies/search?query=inception')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.results).toBeDefined();
    });

    it('should return 400 without query', async () => {
      await request(app)
        .get('/api/movies/search')
        .expect(400);
    });
  });

  describe('GET /api/movies/:id', () => {
    it('should get movie details', async () => {
      const res = await request(app)
        .get('/api/movies/550') // Fight Club
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBe(550);
    });
  });
});
