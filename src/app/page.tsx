'use client';
import { useState } from 'react';
import './style.css';
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // Updated import
import { useAuthStore } from './auth';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(1, { message: "Password is required." }),
});

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  form?: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined }); // Clear field-specific errors
  };

  const handleLogin = async () => {
    try {
      // Validate input data
      loginSchema.parse(formData);

      const response = await fetch(
        "https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, isEmployee: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials.");
      }

      const data = await response.json();
      setToken(data.token);

      const userResponse = await fetch(
        "https://api-yeshtery.dev.meetusvr.com/v1/user/info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info.");
      }

      const userData = await userResponse.json();
      setUser({ id: userData.id, name: userData.name });

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Extract validation errors
        const zodErrors = err.errors.reduce(
          (acc: Errors, curr) => ({ ...acc, [curr.path[0] as keyof FormData]: curr.message }),
          {}
        );
        setErrors(zodErrors);
      } else if (err instanceof Error) {
        setErrors({ form: err.message });
      }
    }
  };

  return (
    <>
      <header className="text-black h-screen flex justify-start items-center w-screen">
        <div className="p-5 text-center w-1/2">
          <h1 className="text-4xl">Welcome Back</h1>
          <div className="flex justify-center items-center">
            <p className="text-l text-gray-400 p-5 w-1/2">
              Step into our shopping metaverse for an unforgettable shopping experience.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="w-1/2 flex flex-col justify-center items-center"
            >
              <div className="email">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  //autoComplete="email"
                  
                  className="mb-3 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
                {
                errors.email && <p style={{ color: "red" }}>{errors.email}</p>
              }
              <div className="password">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
                {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
              <button
                type="submit"
                disabled={!formData.email || !formData.password}
                className="btn bg-purple-500 px-10 py-2 hover:bg-purple-900 hover:text-white rounded mt-5"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        <div className="w-1/4">
          <img src="./Group 1216257798.png" className="w-full" alt="image" />
        </div>
      </header>
    </>
  );
}
