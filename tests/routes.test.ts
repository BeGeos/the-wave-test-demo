import 'dotenv/config';

import { expect, describe, it, vi, afterEach } from 'vitest';
import superset from 'supertest';

import * as _charManager from '../src/apps/characters/db/manager';

import { app } from '../src/server';

const client = superset(app);

describe('Characters Api Routes', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('List responds with 200', async function () {
    const m_getAll = vi.spyOn(_charManager, 'getAll').mockResolvedValueOnce([]);

    const response = await client
      .get('/api/v1/characters')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(m_getAll).toHaveBeenCalledTimes(1);
  });

  it('Details responds with 404 if no instance', async function () {
    const id = Math.ceil(Math.random() * 100);

    const m_get = vi.spyOn(_charManager, 'get').mockResolvedValueOnce(null);

    const response = await client
      .get('/api/v1/characters/' + id)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(m_get).toHaveBeenCalledTimes(1);
    expect(m_get).toBeCalledWith(id);
  });

  it('Details responds with 200 if instance', async function () {
    const character = {
      id: Math.ceil(Math.random() * 100),
      name: 'Random Name XYZ',
      gender: 'male',
      status: 'alive',
      species: 'human',
      description: 'Gibberish',
      description_html: '<strong>Gibberish</strong>',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const m_get = vi
      .spyOn(_charManager, 'get')
      .mockResolvedValueOnce(character);

    const response = await client
      .get('/api/v1/characters/' + character.id)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);

    // createdAt & updatedAt are parsed as dates but return as strings
    expect(response.body.id).toBe(character.id);
    expect(response.body.name).toBe(character.name);
    expect(response.body.gender).toBe(character.gender);
    expect(response.body.status).toBe(character.status);
    expect(response.body.species).toBe(character.species);
    expect(response.body.description).toBe(character.description);
    expect(response.body.description_html).toBe(character.description_html);
    expect(response.body.createdAt).toBe(character.createdAt.toISOString());
    expect(response.body.updatedAt).toBe(character.updatedAt.toISOString());

    expect(m_get).toHaveBeenCalledTimes(1);
    expect(m_get).toBeCalledWith(character.id);
  });

  it('Create character responds with 400 if body is invalid', async function () {
    // Name is required and it's missing
    const character = {
      gender: 'male',
      status: 'alive',
      species: 'human',
    };

    const m_create = vi
      .spyOn(_charManager, 'create')
      .mockRejectedValueOnce(new Error());

    const response = await client
      .post('/api/v1/characters/')
      .send(character)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(m_create).toHaveBeenCalledTimes(1);
    expect(m_create).toBeCalledWith(character);
  });

  it('Create character responds with 201 if body is valid', async function () {
    const character = {
      id: Math.ceil(Math.random() * 100),
      name: 'Random Name XYZ',
      gender: 'male',
      status: 'alive',
      species: 'human',
      description: 'Gibberish',
      description_html: '<strong>Gibberish</strong>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const m_create = vi
      .spyOn(_charManager, 'create')
      .mockResolvedValueOnce(character);

    const response = await client
      .post('/api/v1/characters/')
      .send(character)
      .set('Accept', 'application/json');

    expect(response.body.id).toBe(character.id);
    expect(response.body.name).toBe(character.name);
    expect(response.body.gender).toBe(character.gender);
    expect(response.body.status).toBe(character.status);
    expect(response.body.species).toBe(character.species);
    expect(response.body.description).toBe(character.description);
    expect(response.body.description_html).toBe(character.description_html);
    expect(response.body.createdAt).toBe(character.createdAt);
    expect(response.body.updatedAt).toBe(character.updatedAt);

    expect(response.status).toEqual(201);
    expect(m_create).toHaveBeenCalledTimes(1);
    expect(m_create).toBeCalledWith(character);
  });

  it('Update character responds with 404 if no character', async function () {
    const id = Math.ceil(Math.random() * 100);

    const m_update = vi
      .spyOn(_charManager, 'update')
      .mockResolvedValueOnce(null);

    const response = await client
      .put('/api/v1/characters/' + id)
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(m_update).toHaveBeenCalledTimes(1);
    expect(m_update).toBeCalledWith(id, {});
  });

  it('Update character responds with 400 if body is invalid', async function () {
    const id = Math.ceil(Math.random() * 100);

    const m_update = vi
      .spyOn(_charManager, 'update')
      .mockRejectedValueOnce(new Error());

    const response = await client
      .put('/api/v1/characters/' + id)
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(m_update).toHaveBeenCalledTimes(1);
    expect(m_update).toBeCalledWith(id, {});
  });

  it('Update character responds with 200 if body is valid', async function () {
    const id = Math.ceil(Math.random() * 100);
    const name = 'Random name ABC';

    const m_update = vi
      .spyOn(_charManager, 'update')
      .mockResolvedValueOnce([{ name }]);

    const response = await client
      .put('/api/v1/characters/' + id)
      .send({ name })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(m_update).toHaveBeenCalledTimes(1);
    expect(m_update).toBeCalledWith(id, { name });
  });

  it('Delete character responds with 204 and no body is returned', async function () {
    const id = Math.ceil(Math.random() * 100);

    const m_update = vi.spyOn(_charManager, 'del').mockResolvedValueOnce(null);

    const response = await client
      .delete('/api/v1/characters/' + id)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(204);
    expect(m_update).toHaveBeenCalledTimes(1);
    expect(m_update).toBeCalledWith(id);
    expect(Object.keys(response.body).length).toBe(0); // the response is empty
  });
});

import * as _locManager from '../src/apps/locations/db/manager';

describe('Locations Api Routes', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('List responds with 200', async function () {
    const m_getAll = vi.spyOn(_locManager, 'getAll').mockResolvedValueOnce([]);
    const m_getMany__from_locations = vi
      .spyOn(_charManager, 'getMany__from_locations')
      .mockResolvedValueOnce([]);

    const response = await client
      .get('/api/v1/locations')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(m_getAll).toHaveBeenCalledTimes(1);
  });

  it('Details responds with 404 if no instance', async function () {
    const id = Math.ceil(Math.random() * 100);

    const m_get = vi.spyOn(_locManager, 'get').mockResolvedValueOnce(null);

    const response = await client
      .get('/api/v1/locations/' + id)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(m_get).toHaveBeenCalledTimes(1);
    expect(m_get).toBeCalledWith(id);
  });

  it('Details responds with 200 if instance', async function () {
    const location = {
      id: Math.ceil(Math.random() * 100),
      name: 'Random Name XYZ',
      type: 'planet',
      dimension: 'some random dimension',
      createdAt: new Date(),
      characters: [],
    };

    const m_get = vi.spyOn(_locManager, 'get').mockResolvedValueOnce(location);

    const response = await client
      .get('/api/v1/locations/' + location.id)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);

    // createdAt & updatedAt are parsed as dates but return as strings
    expect(response.body.id).toBe(location.id);
    expect(response.body.name).toBe(location.name);
    expect(response.body.type).toBe(location.type);
    expect(response.body.dimension).toBe(location.dimension);
    expect(response.body.createdAt).toBe(location.createdAt.toISOString());
    expect(response.body.characters.length).toBe(0);
    expect(response.body.url).toBeDefined(); // url is populated by the route

    expect(m_get).toHaveBeenCalledTimes(1);
    expect(m_get).toBeCalledWith(location.id);
  });
});

import * as _epiManager from '../src/apps/episodes/db/manager';

describe('Episodes Api Routes', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('List responds with 200', async function () {
    const m_getAll = vi.spyOn(_epiManager, 'getAll').mockResolvedValueOnce([]);
    const m_getMany__from_episodes = vi
      .spyOn(_charManager, 'getMany__from_episodes')
      .mockResolvedValueOnce([]);

    const response = await client
      .get('/api/v1/episodes')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(m_getAll).toHaveBeenCalledTimes(1);
  });

  it('Details responds with 404 if no instance', async function () {
    const id = Math.ceil(Math.random() * 100);

    const m_get = vi.spyOn(_epiManager, 'get').mockResolvedValueOnce(null);

    const response = await client
      .get('/api/v1/episodes/' + id)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(m_get).toHaveBeenCalledTimes(1);
    expect(m_get).toBeCalledWith(id);
  });

  it('Details responds with 200 if instance', async function () {
    const episode = {
      id: Math.ceil(Math.random() * 100),
      name: 'Random Name XYZ',
      airDate: '1985-10-26',
      episode: 'S1E1',
      createdAt: new Date(),
      character_through_set: [],
    };

    const m_get = vi.spyOn(_epiManager, 'get').mockResolvedValueOnce(episode);

    const response = await client
      .get('/api/v1/episodes/' + episode.id)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);

    // createdAt & updatedAt are parsed as dates but return as strings
    expect(response.body.id).toBe(episode.id);
    expect(response.body.name).toBe(episode.name);
    expect(response.body.airDate).toBe(episode.airDate);
    expect(response.body.episode).toBe(episode.episode);
    expect(response.body.createdAt).toBe(episode.createdAt.toISOString());
    expect(response.body.characters.length).toBe(0);
    expect(response.body.url).toBeDefined(); // url is populated by the route

    expect(m_get).toHaveBeenCalledTimes(1);
    expect(m_get).toBeCalledWith(episode.id);
  });
});

describe('Utils func in routes', async () => {
  const reverse = (await import('../src/routes')).reverse;

  it('Reverse returns the correct url', async () => {
    const expectedCharUrl_v1 = '/api/v1/characters';
    const expectedCharUrl_v1__external =
      process.env.ROOT_URL + expectedCharUrl_v1;
    const expectedLocUrl_v1 = '/api/v1/locations';
    const expectedLocUrl_v1__external =
      process.env.ROOT_URL + expectedLocUrl_v1;
    const expectedEpiUrl_v1 = '/api/v1/episodes';
    const expectedEpiUrl_v1__external =
      process.env.ROOT_URL + expectedEpiUrl_v1;

    // Characters
    expect(reverse('characters:base_v1'), expectedCharUrl_v1);
    expect(
      reverse('characters:base_v1', null, true),
      expectedCharUrl_v1__external
    );

    // Locations
    expect(reverse('locations:base_v1'), expectedLocUrl_v1);
    expect(
      reverse('locations:base_v1', null, true),
      expectedLocUrl_v1__external
    );

    // Episodes
    expect(reverse('episodes:base_v1'), expectedEpiUrl_v1);
    expect(
      reverse('episodes:base_v1', null, true),
      expectedEpiUrl_v1__external
    );
  });

  it('Reverse returns the correct url with kwargs', async () => {
    const id = Math.ceil(Math.random() * 100);
    const expectedCharUrl_v1 = `/api/v1/characters/${id}`;
    const expectedCharUrl_v1__external =
      process.env.ROOT_URL + expectedCharUrl_v1;
    const expectedLocUrl_v1 = `/api/v1/locations/${id}`;
    const expectedLocUrl_v1__external =
      process.env.ROOT_URL + expectedLocUrl_v1;
    const expectedEpiUrl_v1 = `/api/v1/episodes/${id}`;
    const expectedEpiUrl_v1__external =
      process.env.ROOT_URL + expectedEpiUrl_v1;

    // Characters
    expect(reverse('characters:details_v1'), expectedCharUrl_v1);
    expect(
      reverse('characters:details_v1', { id }, true),
      expectedCharUrl_v1__external
    );

    // Locations
    expect(reverse('locations:details_v1'), expectedLocUrl_v1);
    expect(
      reverse('locations:details_v1', { id }, true),
      expectedLocUrl_v1__external
    );

    // Episodes
    expect(reverse('episodes:details_v1'), expectedEpiUrl_v1);
    expect(
      reverse('episodes:details_v1', { id }, true),
      expectedEpiUrl_v1__external
    );
  });
});
