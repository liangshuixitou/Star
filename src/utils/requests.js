import axios from 'axios';
import qs from 'qs';

export default async function post (url, data) {
	const { data: res } = await axios({
		url: url,
		method: 'post',
		data: qs.stringify(data)
	});
	return res;
}
