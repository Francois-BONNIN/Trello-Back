const request = require('supertest');
const app = require('./index');



describe('Test the root path', () => {
    test('It should respond with an array of users', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('Test the /signup path', () => {
    test('It should create a new user and return a token', async () => {
        const response = await request(app)
            .post('/signup')
            .send({ email: 'test@test.com', password: 'password' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email', 'test@test.com');
        expect(response.body).toHaveProperty('token');
    });
});

describe('Test the /login path', () => {
    test('It should return a token for a valid user', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@test.com', password: 'password' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email', 'test@test.com');
        expect(response.body).toHaveProperty('token');
    });

    test('It should return an error for an invalid user', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@test.com', password: 'wrongpassword' });
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Password!');
    });
});

describe('Test the /tasks path', () => {
    test('It should respond with an array of tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('Test the /new path', () => {
    test('It should create a new task and return the task object', async () => {
        const task = { title: 'Test Task', description: 'This is a test task' };
        const response = await request(app).post('/new').send(task);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', 'Test Task');
        expect(response.body).toHaveProperty('description', 'This is a test task');
    });
});

describe('Test the /:id path', () => {
    test('It should update a task and return the updated task object', async () => {
        const task = { title: 'Updated Task', description: 'This is an updated task' };
        const response = await request(app).put('/1').send(task);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('title', 'Updated Task');
        expect(response.body).toHaveProperty('description', 'This is an updated task');
    });
});

describe('Test the /:id path', () => {
    test('It should delete a task and return the deleted task object', async () => {
        const response = await request(app).delete('/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });
});