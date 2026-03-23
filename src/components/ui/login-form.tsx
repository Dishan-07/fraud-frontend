/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { User, Lock, ArrowRight, Shield } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { login, register, forgotPassword, verifyOTP, resetPassword } from '../../api/predict';

// Vertex shader source code
const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// Fragment shader source code for the smokey background effect
const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    for (float i = 1.0; i < 3.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface SmokeyBackgroundProps {
  backdropBlurAmount?: string;
  color?: string;
  className?: string;
}

const blurClassMap: Record<BlurSize, string> = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

export function SmokeyBackground({
  backdropBlurAmount = "sm",
  color = "#1E40AF",
  className = "",
}: SmokeyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let cleanupListeners: (() => void) | null = null;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

      const compileShader = (type: number, source: string): WebGLShader | null => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
      if (!vertexShader || !fragmentShader) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
      const iTimeLocation = gl.getUniformLocation(program, "iTime");
      const iMouseLocation = gl.getUniformLocation(program, "iMouse");
      const uColorLocation = gl.getUniformLocation(program, "u_color");

      const startTime = Date.now();
      const [r, g, b] = hexToRgb(color);
      gl.uniform3f(uColorLocation, r, g, b);

      const render = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        const currentTime = (Date.now() - startTime) / 1000;
        gl.uniform2f(iResolutionLocation, width, height);
        gl.uniform1f(iTimeLocation, currentTime);
        
        const mouseX = mouseRef.current.isHovering ? mouseRef.current.x : width / 2;
        const mouseY = mouseRef.current.isHovering ? height - mouseRef.current.y : height / 2;
        gl.uniform2f(iMouseLocation, mouseX, mouseY);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
      };
      const handleMouseEnter = () => { mouseRef.current.isHovering = true; };
      const handleMouseLeave = () => { mouseRef.current.isHovering = false; };

      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseenter", handleMouseEnter);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      render();

      cleanupListeners = () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseenter", handleMouseEnter);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      };

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (cleanupListeners) cleanupListeners();
    };
  }, [color]);

  const finalBlurClass = blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap["sm"];

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className={`absolute inset-0 ${finalBlurClass}`}></div>
    </div>
  );
}

// ── FORM MODES ────────────────────────────────────────────────
type FormMode = "login" | "signup" | "forgot" | "otp" | "reset";

export function LoginForm({ onLogin }: { onLogin?: () => void }) {
  const { updateState } = useAppContext();

  const [mode, setMode] = useState<FormMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── LOGIN ─────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const data = await login(email, password);
      updateState({ name: data.user.full_name, email: data.user.email });
      if (onLogin) onLogin();
    } catch (err) {
      setError((err as any).message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTER ──────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess("Account created! Welcome email sent. Please sign in.");
      setMode("login");
      setPassword("");
    } catch (err) {
      setError((err as any).message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── FORGOT PASSWORD — send OTP ────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess("OTP sent to your email! Check inbox and spam.");
      setMode("otp");
    } catch (err) {
      setError((err as any).message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── VERIFY OTP ────────────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await verifyOTP(email, otpCode);
      setSuccess("OTP verified! Enter your new password.");
      setMode("reset");
    } catch (err) {
      setError((err as any).message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── RESET PASSWORD ────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await resetPassword(email, otpCode, newPassword);
      setSuccess("Password reset successfully! Please sign in.");
      setMode("login");
      setOtpCode(""); setNewPassword("");
    } catch (err) {
      setError((err as any).message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ── TITLE per mode ────────────────────────────────────────
  const titles: Record<FormMode, string> = {
    login: "Sign IN to your account",
    signup: "Create a new account",
    forgot: "Reset your password",
    otp: "Enter OTP from email",
    reset: "Set new password",
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-background rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative z-20">
      {/* Header */}
      <div className="text-center flex flex-col items-center">
        <div className="relative flex items-center justify-center w-12 h-12 mb-2">
          <div className="absolute inset-0 bg-secondary rounded-full opacity-20 animate-pulse-slow blur-md"></div>
          <Shield className="text-secondary w-8 h-8 relative z-10 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </div>
        <h2 className="text-4xl font-display font-bold text-white tracking-wide mt-2">
          FraudShield <span className="text-secondary">AI</span>
        </h2>
        <p className="mt-2 text-base font-sans text-text-secondary">{titles[mode]}</p>
      </div>

      {/* Error / Success messages */}
      {error && <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2 px-3">{error}</p>}
      {success && <p className="text-green-400 text-sm text-center bg-green-400/10 rounded-lg py-2 px-3">{success}</p>}

      {/* ── LOGIN FORM ── */}
      {mode === "login" && (
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative z-0">
            <input type="email" id="login_email" value={email} onChange={e => setEmail(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300"
              placeholder=" " required />
            <label htmlFor="login_email" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <User className="inline-block mr-2 -mt-1" size={16} />Email Address
            </label>
          </div>
          <div className="relative z-0">
            <input type="password" id="login_password" value={password} onChange={e => setPassword(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300"
              placeholder=" " required />
            <label htmlFor="login_password" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <Lock className="inline-block mr-2 -mt-1" size={16} />Password
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => { clearMessages(); setMode("forgot"); }}
              className="text-base font-sans text-text-tertiary hover:text-secondary transition-colors">
              Forgot Password?
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="group w-full flex items-center justify-center py-4 px-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg text-secondary text-lg font-bold font-sans border border-secondary/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-text-tertiary font-sans text-sm font-medium tracking-widest text-[#a1a1aa]">OR VIA SSO</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>
          <button type="button" onClick={() => {
            updateState({ name: "Google User", email: "user@google.com" });
            if (onLogin) onLogin();
          }}
            className="w-full flex items-center justify-center py-3 px-4 bg-surface-bright hover:bg-white/5 rounded-lg text-text-primary text-base font-sans font-semibold border border-white/5 transition-all duration-300">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5S45.5 36.017 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.839-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.642 6.723 6.306 14.691z"></path>
              <path fill="#4CAF50" d="M24 45.5c5.613 0 10.553-2.306 14.802-6.341l-5.839-5.841C30.842 35.846 27.059 38 24 38c-5.039 0-9.345-2.608-11.124-6.481l-6.571 4.819C9.642 41.277 16.318 45.5 24 45.5z"></path>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.839 5.841C44.196 35.123 45.5 29.837 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path>
            </svg>
            Sign in with Google
          </button>
        </form>
      )}

      {/* ── SIGNUP FORM ── */}
      {mode === "signup" && (
        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="relative z-0">
            <input type="text" id="signup_name" value={name} onChange={e => setName(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300"
              placeholder=" " required />
            <label htmlFor="signup_name" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <User className="inline-block mr-2 -mt-1" size={16} />Full Name
            </label>
          </div>
          <div className="relative z-0">
            <input type="email" id="signup_email" value={email} onChange={e => setEmail(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300"
              placeholder=" " required />
            <label htmlFor="signup_email" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <User className="inline-block mr-2 -mt-1" size={16} />Email Address
            </label>
          </div>
          <div className="relative z-0">
            <input type="password" id="signup_password" value={password} onChange={e => setPassword(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300"
              placeholder=" " required />
            <label htmlFor="signup_password" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <Lock className="inline-block mr-2 -mt-1" size={16} />Password
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="group w-full flex items-center justify-center py-4 px-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg text-secondary text-lg font-bold font-sans border border-secondary/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 disabled:opacity-50">
            {loading ? "Creating account..." : "Sign Up"}
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      )}

      {/* ── FORGOT PASSWORD FORM ── */}
      {mode === "forgot" && (
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div className="relative z-0">
            <input type="email" id="forgot_email" value={email} onChange={e => setEmail(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300"
              placeholder=" " required />
            <label htmlFor="forgot_email" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <User className="inline-block mr-2 -mt-1" size={16} />Email Address
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="group w-full flex items-center justify-center py-4 px-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg text-secondary text-lg font-bold font-sans border border-secondary/50 transition-all duration-300 disabled:opacity-50">
            {loading ? "Sending OTP..." : "Send OTP"}
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
          <button type="button" onClick={() => { clearMessages(); setMode("login"); }}
            className="w-full text-base text-text-tertiary hover:text-secondary transition-colors text-center">
            ← Back to Sign In
          </button>
        </form>
      )}

      {/* ── OTP FORM ── */}
      {mode === "otp" && (
        <form className="space-y-6" onSubmit={handleVerifyOTP}>
          <p className="text-base text-text-tertiary text-center">OTP sent to <span className="text-secondary">{email}</span></p>
          <div className="relative z-0">
            <input type="text" id="otp_code" value={otpCode} onChange={e => setOtpCode(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300 tracking-[0.5em] text-center"
              placeholder="000000" maxLength={6} required />
            <label htmlFor="otp_code" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Enter 6-digit OTP
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="group w-full flex items-center justify-center py-4 px-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg text-secondary text-lg font-bold font-sans border border-secondary/50 transition-all duration-300 disabled:opacity-50">
            {loading ? "Verifying..." : "Verify OTP"}
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
          <button type="button" onClick={() => { clearMessages(); setMode("forgot"); }}
            className="w-full text-base text-text-tertiary hover:text-secondary transition-colors text-center">
            ← Resend OTP
          </button>
        </form>
      )}

      {/* ── RESET PASSWORD FORM ── */}
      {mode === "reset" && (
        <form className="space-y-6" onSubmit={handleResetPassword}>
          <div className="relative z-0">
            <input type="password" id="new_password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="block py-3 px-0 w-full text-base font-sans text-white bg-transparent border-0 border-b-2 border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer transition-colors duration-300"
              placeholder=" " required minLength={6} />
            <label htmlFor="new_password" className="absolute text-base font-sans text-text-tertiary duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <Lock className="inline-block mr-2 -mt-1" size={16} />New Password
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="group w-full flex items-center justify-center py-4 px-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg text-secondary text-lg font-bold font-sans border border-secondary/50 transition-all duration-300 disabled:opacity-50">
            {loading ? "Resetting..." : "Reset Password"}
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      )}

      {/* ── BOTTOM TOGGLE (login/signup only) ── */}
      {(mode === "login" || mode === "signup") && (
        <p className="text-center text-base font-sans text-text-tertiary mt-4">
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
          <button type="button" onClick={() => { clearMessages(); setMode(mode === "login" ? "signup" : "login"); }}
            className="font-semibold text-secondary hover:text-white transition-colors ml-2">
            {mode === "signup" ? "Sign In" : "Sign up for new register"}
          </button>
        </p>
      )}
    </div>
  );
}