import { useState } from 'react';
import { forgotPassword } from '../api/userService';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setMessage('');

		try {
			const response = await forgotPassword({email: email});
			setMessage('Password reset link has been sent to your email!');
			setEmail('');
		} catch (err) {
			setError('Failed to send reset email. Please try again.');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-96">
				<h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

				{message && (
					<div className="bg-green-100 text-green-700 p-3 rounded mb-4">
						{message}
					</div>
				)}

				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-2">
							Email Address
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 disabled:bg-gray-400"
					>
						{loading ? 'Sending...' : 'Send Reset Link'}
					</button>
				</form>

				<div className="mt-4 text-center">
					<a href="/login" className="text-blue-600 hover:underline text-sm">
						Back to Login
					</a>
				</div>
			</div>
		</div>
	);
}