import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Re-using the same validation logic
    const validateEmail = (email: string) => {
        const kluPattern = /^\d{11}@klu\.ac\.in$/i;
        return kluPattern.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Email must consist of 11 numbers followed by @klu.ac.in");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) {
                throw error;
            }

            setIsSubmitted(true);
            toast.success("Password reset link sent to your email.");
        } catch (err: any) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-campus-sky via-background to-campus-lavender">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="w-full max-w-md relative animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-4">
                        <GraduationCap className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Smart Campus</h1>
                    <p className="text-muted-foreground text-sm">Academic Hub</p>
                </div>

                <Card variant="glass" className="animate-slide-up">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl">Forgot Password</CardTitle>
                        <CardDescription>Enter your university email to reset your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSubmitted ? (
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-medium">Check your email</p>
                                    <p className="text-sm text-muted-foreground">
                                        We've sent a password reset link to <span className="font-semibold">{email}</span>
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Try another email
                                </Button>
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="text-sm text-primary font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">University Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="99xxxxxxxx@klu.ac.in"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-scale-in">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="campus"
                                    size="lg"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            Sending link...
                                        </span>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>

                                <div className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/login")}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    © 2024 KL University. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
