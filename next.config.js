/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXTAUTH_URL: "http://localhost:3000",
		NEXT_PUBLIC_FIREBASE_API_KEY:
			"AIzaSyDgkU4NbwrDsRb-DSD27tDTwHBcbdJHCtc",
		NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
			"asad-ecomm.firebaseapp.com",
		NEXT_PUBLIC_FIREBASE_PROJECT_ID: "asad-ecomm",
		NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
			"asad-ecomm.appspot.com",
		NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
			"939682571590",
		NEXT_PUBLIC_FIREBASE_APP_ID:
			"1:939682571590:web:920965bbd237ec5425f147",
	},
};

module.exports = nextConfig;
