import * as assert from 'assert';
import * as chai from 'chai';
import * as sinonImport from 'sinon';
import * as fsExtra from 'fs-extra';
const sinon = sinonImport.createSandbox();
const expect = chai.expect;
import * as querystring from 'needle/lib/querystring';
import { ecp, device } from './';

describe('RokuDevice', function () {
	before(async () => {
		await ecp.sendLaunchChannel();
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('sendECP', () => {
		it('should work for POST requests', async () => {
			await device.sendECP('keypress/Right', {}, '');
		});

		it('should work if params are passed in', async () => {
			sinon.stub((device as any), 'needle').callsFake((method, url, data, options?) => {
				expect(url).to.contain(querystring.build(params));
			});
			const params = {
				contentId: 'contentIdValue',
				mediaType: 'special'
			};
			await device.sendECP('launch/dev', params, '');
		});
	});

	describe('getScreenshot [SLOW]', () => {
		it('should output a file if a path was provided', async () => {
			const {path} = await device.getScreenshot('output');
			if (path && !fsExtra.existsSync(path)) {
				assert.fail(`'${path}' did not exist`);
			}
			fsExtra.removeSync(path as string);
		});

		it('should output a buffer if no path was provided', async () => {
			const {buffer} = await device.getScreenshot();
			expect(buffer).to.be.instanceof(Buffer);
			expect(buffer.byteLength).to.be.greaterThan(0);
		});
	});

	describe('getTelnetLog', () => {
		it('should be able to pull telnet logs', async () => {
			const contents = await device.getTelnetLog();
			expect(contents).to.not.be.empty;
		});
	});
});
