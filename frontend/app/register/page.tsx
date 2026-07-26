'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (name.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);

      toast.success('Account created successfully!');
      router.push('/dashboard');

    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );

    } finally {
      setIsLoading(false);
    }
  };


  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10
      ? 2
      : 3;


  const strengthColors = [
    '',
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
  ];

  const strengthLabels = [
    '',
    'Weak',
    'Fair',
    'Strong',
  ];


  return (
    <div className="min-h-screen flex bg-gray-950 overflow-hidden">

      {/* Left Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-between">

        {/* Animated Background */}
        <div className="absolute inset-0">
          {[
            { width: 120, height: 120, left: "10%", top: "20%" },
            { width: 180, height: 180, left: "70%", top: "30%" },
            { width: 150, height: 150, left: "40%", top: "70%" },
            { width: 100, height: 100, left: "80%", top: "80%" },
            { width: 200, height: 200, left: "20%", top: "60%" },
            { width: 130, height: 130, left: "60%", top: "10%" },
            { width: 170, height: 170, left: "30%", top: "40%" },
            { width: 110, height: 110, left: "90%", top: "50%" },
          ].map((circle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: circle.width,
                height: circle.height,
                left: circle.left,
                top: circle.top,
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>

            <span className="text-2xl font-bold text-white">
              TaskFlow
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Start your
            <br />
            productivity journey
          </h1>

          <p className="text-white/70 text-lg">
            Join and experience a smarter way to manage tasks.
          </p>
        </div>

      </div>
              {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md py-8"
          >

            <div className="text-center mb-8">

              <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>

                <span className="text-xl font-bold text-white">
                  TaskFlow
                </span>
              </div>


              <h2 className="text-3xl font-bold text-white mb-2">
                Create an account
              </h2>

              <p className="text-gray-400">
                Join TaskFlow and start organizing your tasks
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Name */}

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full name
                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>



              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>


                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />


                  <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>




              {/* Password */}

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>


                <div className="relative">


                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>


                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />


                  <button
                    type="button"
                    onClick={()=>setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >

                    {
                      showPassword
                      ?
                      <EyeOff className="w-5 h-5"/>
                      :
                      <Eye className="w-5 h-5"/>
                    }

                  </button>


                </div>



                {
                  password && (

                    <div className="mt-2 flex items-center gap-2">

                      <div className="flex gap-1 flex-1">

                        {[1,2,3].map((i)=>(

                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              passwordStrength >= i
                              ? strengthColors[passwordStrength]
                              : "bg-gray-700"
                            }`}
                          />

                        ))}

                      </div>


                      <span className="text-xs text-gray-300">
                        {strengthLabels[passwordStrength]}
                      </span>


                    </div>

                  )
                }


              </div>





              {/* Confirm Password */}

              <div>


                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm password
                </label>


                <div className="relative">


                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>


                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-800 border text-white ${
                      confirmPassword && confirmPassword !== password
                      ? "border-red-500"
                      : "border-gray-700"
                    }`}
                  />


                  <button
                    type="button"
                    onClick={()=>setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >

                    {
                      showConfirm
                      ?
                      <EyeOff className="w-5 h-5"/>
                      :
                      <Eye className="w-5 h-5"/>
                    }

                  </button>


                </div>


              </div>
                            {/* Submit Button */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >

                {
                  isLoading
                  ?
                  <>
                    <Loader2 className="w-5 h-5 animate-spin"/>
                    Creating account...
                  </>
                  :
                  "Create account"
                }

              </button>


            </form>



            <p className="text-center text-gray-400 mt-6">

              Already have an account?{" "}

              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign in
              </Link>

            </p>



          </motion.div>


        </div>


      </div>
  );
}
