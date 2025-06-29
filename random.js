const url = 'https://jsearch.p.rapidapi.com/estimated-salary?job_title=nodejs%20developer&location=new%20york&location_type=ANY&years_of_experience=ALL';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '6252361aafmshfcdb9a2f67451b5p142b34jsn6b33251230e1',
		'x-rapidapi-host': 'jsearch.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}