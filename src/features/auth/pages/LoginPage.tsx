import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '../components/LoginForm'
import { ROUTES } from '@/constants/routes.constant'

export function LoginPage() {
    return (
        <div className="w-full max-w-md mx-auto my-12">
            <Card className="shadow-sm p-4">
                {/* HEADER */}
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold">
                        Login
                    </CardTitle>

                    {/* Optional: helpful description */}
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to access your account
                    </p>
                </CardHeader>

                {/* CONTENT */}
                <CardContent>
                    <LoginForm />
                </CardContent>

                {/* FOOTER */}
                <CardContent className="pt-0">
                    <div className="flex flex-col gap-3 text-sm">

                        {/* Forgot password */}
                        <div className="text-right">
                            <a
                                href={ROUTES.AUTH.FORGOT_PASSWORD}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 border-t" />
                            <span className="text-xs text-muted-foreground">OR</span>
                            <div className="flex-1 border-t" />
                        </div>

                        {/* Register */}
                        <div className="text-center">
                            <span className="text-muted-foreground">
                                Don&apos;t have an account?{" "}
                            </span>
                            <a
                                href={ROUTES.AUTH.REGISTER}
                                className="font-medium text-primary hover:underline"
                            >
                                Register
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
