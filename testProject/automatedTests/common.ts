import { odc } from 'roku-test-automation';

export async function waitForApplicationLoad() {
	return odc.onFieldChangeOnce({keyPath: 'launchComplete', match: true})
}
