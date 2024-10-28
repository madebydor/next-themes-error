export async function GET(): Promise<Response> {
	console.log("kurde");
	return new Response("Hello, world!");
}
