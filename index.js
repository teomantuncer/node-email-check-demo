const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const router = new Router();
const emailCheck = require('node-email-check');
const { createReadStream } = require('fs');

router
	.get('/', (ctx, next) => {
		ctx.type = 'html';
		ctx.body = createReadStream('./public/index.html');
	})
	.post('/check', async (ctx, next) => {
		const { email } = ctx.request.body;
		if (!email) {
			ctx.body = { error: 'Email is required' };
			ctx.status = 400;
			return;
		}
		ctx.body = {
			isValid: await emailCheck.isValid(email)
		}
	})
	.post('/sync-check', (ctx, next) => {
		const { email } = ctx.request.body;
		if (!email) {
			ctx.body = { error: 'Email is required' };
			ctx.status = 400;
			return;
		}
		ctx.body = {
			isValid: emailCheck.isValidSync(email)
		}
	})


app
	.use(async (ctx, next) => {
		const start = Date.now();
		await next();
		const ms = Date.now() - start;
		ctx.set('X-Response-Time', `${ms}ms`);
	})
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(3000)
