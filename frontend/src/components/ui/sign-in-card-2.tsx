'use client';
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface SignInCardProps {
  onLoginSubmit?: (credentials: { email: string; password: string; rememberMe: boolean }) => void;
  onRoleQuickSelect?: (role: string) => void;
  brandTitle?: string;
  brandSubtitle?: string;
}

export function Component({
  onLoginSubmit,
  onRoleQuickSelect,
  brandTitle = "Login",
  brandSubtitle = "Welcome back please login to your account"
}: SignInCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 3D smooth tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-250, 250], [8, -8]);
  const rotateY = useTransform(mouseX, [-250, 250], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (onLoginSubmit) {
      onLoginSubmit({ email, password, rememberMe });
      setTimeout(() => setIsLoading(false), 1200);
    } else {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-x-hidden flex flex-col items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/nature-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Soft natural golden hour & depth overlay */}
      <div className="absolute inset-0 bg-black/15 backdrop-brightness-[0.98] pointer-events-none" />

      {/* Floating Frosted Glass Login Container with Fast Smooth Fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[430px] relative z-10"
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative transition-transform duration-200 ease-out"
        >
          {/* Frosted Glass Outer Card */}
          <div
            className={cn(
              "relative rounded-[36px] p-7 sm:p-9",
              "bg-white/[0.14] backdrop-blur-2xl",
              "border border-white/40 border-t-white/60",
              "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)]",
              "text-white font-sans overflow-hidden"
            )}
          >
            {/* Top specular glaze arc reflection */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none rounded-t-[36px]" />

            {/* Header: Login & Subtitle */}
            <div className="space-y-1.5 mb-7 relative z-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {brandTitle}
              </h1>
              <p className="text-white/85 text-xs sm:text-sm font-medium leading-relaxed">
                {brandSubtitle}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* User Name Input */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="User Name"
                  autoComplete="username"
                  className={cn(
                    "w-full px-5 py-3.5 pr-12 rounded-2xl",
                    "bg-white/10 hover:bg-white/15 focus:bg-white/20",
                    "border border-white/35 focus:border-white/80",
                    "text-white placeholder:text-white/70 text-sm font-medium",
                    "focus:outline-none focus:ring-2 focus:ring-white/40",
                    "transition-all duration-200 shadow-inner"
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/75 pointer-events-none">
                  <User className="w-5 h-5 stroke-[1.75]" />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className={cn(
                    "w-full px-5 py-3.5 pr-12 rounded-2xl",
                    "bg-white/10 hover:bg-white/15 focus:bg-white/20",
                    "border border-white/35 focus:border-white/80",
                    "text-white placeholder:text-white/70 text-sm font-medium",
                    "focus:outline-none focus:ring-2 focus:ring-white/40",
                    "transition-all duration-200 shadow-inner"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/75 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 stroke-[1.75]" />
                  ) : (
                    <EyeOff className="w-5 h-5 stroke-[1.75]" />
                  )}
                </button>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-white/95 cursor-pointer select-none group">
                  <span
                    onClick={() => setRememberMe(!rememberMe)}
                    className={cn(
                      "w-4 h-4 rounded-md flex items-center justify-center transition-all",
                      rememberMe
                        ? "bg-[#22c55e] text-white shadow-xs"
                        : "bg-white/20 border border-white/50 group-hover:border-white"
                    )}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="font-medium">Remember me</span>
                </label>
              </div>

              {/* Lime to Emerald Gradient Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 px-6 rounded-2xl",
                  "bg-gradient-to-r from-[#9ecb2d] via-[#48b749] to-[#22a45a]",
                  "hover:from-[#a7d72f] hover:via-[#4ec74f] hover:to-[#25b262]",
                  "text-white text-base font-extrabold tracking-wide",
                  "shadow-[0_10px_25px_-5px_rgba(34,197,94,0.45)]",
                  "hover:shadow-[0_12px_28px_-5px_rgba(34,197,94,0.55)]",
                  "active:scale-[0.985] transition-all duration-200",
                  "flex items-center justify-center gap-2 min-h-[48px]",
                  isLoading && "opacity-80 cursor-wait"
                )}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span>Login</span>
                )}
              </button>

              {/* Signup Link */}
              <div className="text-center pt-2 text-xs sm:text-sm text-white/90">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onRoleQuickSelect) onRoleQuickSelect('STUDENT');
                  }}
                  className="font-bold text-white hover:underline transition-all underline-offset-2"
                >
                  Signup
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Component;
