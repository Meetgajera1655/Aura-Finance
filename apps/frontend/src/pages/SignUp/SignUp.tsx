import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema, signupUser } from "@/validation/userSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SocialButtons from "@/components/Auth/SocialButtons";
import LogoIcon from "@/components/LogoIcon";
import { signUp } from "@/api/authService";
import { parseApiError } from "@/lib/apiError";

type signupFields = signupUser;

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<signupFields>({ resolver: zodResolver(signupSchema) });

  const onSubmit: SubmitHandler<signupFields> = async (data) => {
    try {
      const response = await signUp(data);
      if (response.data.success) {
        navigate(`/login`);
      }
    } catch (error) {
      const apiError = parseApiError(error, "Unable to sign up. Please try again");
      console.error("Sign up failed", apiError);
      setError("root", { message: apiError.message });
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex min-h-screen w-full relative">
      {/* Mobile Background */}
      <div 
        className="absolute inset-0 z-0 lg:hidden"
        style={{
          backgroundImage: "url('/auth_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-0"></div>
      </div>

      {/* Left Panel: Branding / Showcase (Hidden on Mobile) */}
      <div 
        className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center z-10"
        style={{
          backgroundImage: "url('/auth_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Dark overlay to ensure text readability on the abstract image */}
        <div className="absolute inset-0 bg-slate-950/60 z-0 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-0"></div>

        <div className="z-10 flex flex-col items-center justify-center p-12 w-full max-w-2xl text-center">
          <div className="flex items-center space-x-4 mb-8">
            <LogoIcon className="w-20 h-20 text-blue-400 drop-shadow-xl" />
            <div className="flex items-baseline">
              <span className="text-6xl font-extrabold text-white tracking-tighter drop-shadow-md">AURA</span>
              <span className="text-6xl font-light text-amber-500 ml-1 drop-shadow-md">FINANCE</span>
            </div>
          </div>
          <p className="text-2xl text-blue-100 max-w-lg font-light leading-relaxed mt-4 drop-shadow-sm">
            Join thousands of developers and analysts shaping the future of finance.
          </p>
          
          <div className="mt-16 grid grid-cols-2 gap-8 text-left w-full max-w-lg">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className="font-semibold text-lg text-white">Instant Access</span>
              </div>
              <p className="text-blue-200 text-sm">Create an account in seconds and immediately access our powerful dashboard.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                <span className="font-semibold text-lg text-white">Highly Modular</span>
              </div>
              <p className="text-blue-200 text-sm">Customize your experience with integrations, widgets, and API access.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: The Form */}
      <div className="flex w-full lg:w-1/2 min-h-screen bg-transparent lg:bg-white lg:dark:bg-gray-950 items-center justify-center p-4 sm:p-8 lg:p-12 z-10">
        <div className="w-full max-w-[440px] space-y-8 bg-white/10 dark:bg-gray-950/40 lg:bg-transparent lg:dark:bg-transparent p-6 sm:p-10 lg:p-0 rounded-[2rem] backdrop-blur-xl lg:backdrop-blur-none border border-white/20 lg:border-transparent shadow-2xl lg:shadow-none">
          
          {/* Mobile Logo (hidden on large screens) */}
          <div className="flex lg:hidden items-center justify-center space-x-3 mb-2">
            <LogoIcon className="w-12 h-12 text-blue-400 drop-shadow-lg" />
            <div className="flex items-baseline">
              <span className="text-3xl font-extrabold text-white tracking-tighter drop-shadow-md">AURA</span>
              <span className="text-3xl font-light text-amber-500 ml-0.5 drop-shadow-md">FINANCE</span>
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white lg:text-gray-900 lg:dark:text-white drop-shadow-sm lg:drop-shadow-none">
              Create an account
            </h1>
            <p className="text-gray-200 lg:text-gray-500 lg:dark:text-gray-400">
              Enter your information to get started
            </p>
          </div>

          {errors.root && (
            <div className="flex items-center bg-red-50/90 dark:bg-red-900/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl backdrop-blur-md">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{errors.root.message}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-semibold text-white lg:text-gray-700 lg:dark:text-gray-300">
                Username
              </Label>
              <Input
                {...register("username")}
                id="username"
                placeholder="johndoe"
                required
                className="h-12 rounded-xl border-white/20 lg:border-gray-200 lg:dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-white/10 lg:bg-transparent lg:dark:bg-gray-900 text-white lg:text-gray-900 lg:dark:text-white placeholder:text-gray-300 lg:placeholder:text-gray-500 transition-all shadow-sm backdrop-blur-sm lg:backdrop-blur-none"
              />
              {errors.username && <p className="text-sm text-red-400 lg:text-red-500 font-medium mt-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-white lg:text-gray-700 lg:dark:text-gray-300">
                Email Address
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 rounded-xl border-white/20 lg:border-gray-200 lg:dark:border-gray-800 focus:ring-2 focus:ring-blue-500 bg-white/10 lg:bg-transparent lg:dark:bg-gray-900 text-white lg:text-gray-900 lg:dark:text-white placeholder:text-gray-300 lg:placeholder:text-gray-500 transition-all shadow-sm backdrop-blur-sm lg:backdrop-blur-none"
              />
              {errors.email && <p className="text-sm text-red-400 lg:text-red-500 font-medium mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-white lg:text-gray-700 lg:dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className="h-12 rounded-xl border-white/20 lg:border-gray-200 lg:dark:border-gray-800 focus:ring-2 focus:ring-blue-500 pr-12 bg-white/10 lg:bg-transparent lg:dark:bg-gray-900 text-white lg:text-gray-900 lg:dark:text-white placeholder:text-gray-300 lg:placeholder:text-gray-500 transition-all shadow-sm backdrop-blur-sm lg:backdrop-blur-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 lg:text-gray-400 hover:text-white lg:hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-400 lg:text-red-500 font-medium mt-1">{errors.password.message}</p>}
            </div>

            <Button
              className="w-full h-12 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin mr-2" />} 
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20 lg:border-gray-200 lg:dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-transparent lg:bg-white lg:dark:bg-gray-950 px-4 text-gray-300 lg:text-gray-500 font-medium backdrop-blur-md lg:backdrop-blur-none rounded-full">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SocialButtons />
          </div>

          <p className="text-center text-sm text-gray-300 lg:text-gray-600 lg:dark:text-gray-400 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 lg:text-blue-600 hover:text-blue-300 lg:hover:text-blue-800 hover:underline transition-colors lg:dark:text-blue-400 lg:dark:hover:text-blue-300"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
