import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";
import { verifyUserEmail } from "@/api/authService";
import { parseApiError } from "@/lib/apiError";
import LogoIcon from "@/components/LogoIcon";

const VerificationStatus = () => {
  const { verificationToken } = useParams();

  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      setStatus("LOADING");
      try {
        const response = await verifyUserEmail(verificationToken);
        if (response.data.success) {
          if (
            response.data.Code === "ALREADY_VERIFIED" ||
            response.data.Code === "VERIFIED"
          ) {
            setStatus("VERIFIED");
            setMessage(response.data.message);
          }
        }
      } catch (error) {
        const apiError = parseApiError(
          error,
          "We could not verify your email. Please request a new link."
        );
        setStatus("VERIFICATION_ERROR");
        setMessage(apiError.message);
      }
    };

    verifyEmail();
  }, [verificationToken]);

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-4"
        style={{
          backgroundImage: "url('/auth_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-0"></div>
        
        <div className="max-w-lg w-full space-y-8 bg-white/10 dark:bg-gray-950/40 p-8 sm:p-10 rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-2xl relative z-10">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <LogoIcon className="w-12 h-12 text-blue-400 drop-shadow-lg" />
            <div className="flex items-baseline">
              <span className="text-3xl font-extrabold text-white tracking-tighter drop-shadow-md">AURA</span>
              <span className="text-3xl font-light text-amber-500 ml-0.5 drop-shadow-md">FINANCE</span>
            </div>
          </div>

          {status === "LOADING" && (
            <div className="flex flex-col justify-center items-center gap-5 py-8">
              <BarLoader color="#3b82f6" />
              <span className="animate-pulse text-blue-300 font-medium tracking-wide">
                Please wait while we verify your email...
              </span>
            </div>
          )}

          {status === "VERIFIED" && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 mb-6 ring-4 ring-green-500/10">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  {message}
                </h2>
                <p className="mt-3 text-base text-gray-300">
                  Your email has been verified. You can now access your dashboard and explore Aura Finance.
                </p>
              </div>

              <div className="mt-10 space-y-6">
                <Button
                  className="w-full h-12 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  asChild
                >
                  <a href="/login">Go to Login</a>
                </Button>

                <div className="text-center space-y-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    Need help?{" "}
                    <a
                      href="#"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Contact support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "VERIFICATION_ERROR" && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/20 mb-6 ring-4 ring-red-500/10">
                  <XCircle className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  Verification Failed
                </h2>
                <p className="mt-3 text-base text-gray-300">
                  We couldn't verify your email address. The link may have expired or is invalid.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <HelpCircle
                        className="h-5 w-5 text-amber-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-300">
                        What can you do now?
                      </h3>
                      <div className="mt-2 text-sm text-amber-200/80">
                        <ul className="list-disc pl-5 space-y-1.5">
                          <li>Try signing up again with the same email</li>
                          <li>Check if your email was typed correctly</li>
                          <li>Contact our support team for assistance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button
                    className="w-full h-12 rounded-xl text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-sm transition-all duration-200"
                    asChild
                  >
                    <Link to="/signup">
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Back to Sign Up
                    </Link>
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-400">
                    Need help?{" "}
                    <Link
                      to="#"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Contact support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerificationStatus;
