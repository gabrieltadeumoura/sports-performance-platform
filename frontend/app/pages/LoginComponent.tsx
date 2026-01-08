"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginForm, loginSchema } from "../schemas/login_schema";
import { loginAction } from "@/lib/auth/server_auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Heart, Lock, Mail, Trophy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../components/Spinner";
import { showToast } from "@/utils/show_toaster";

const LoginComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    try {
      const result = await loginAction(data);
      if (result.success) {
        showToast("Login realizado com sucesso!", "success");
        router.push("/");
      }
    } catch {
      showToast("Erro ao fazer login. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/5 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-green-400/5 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-orange-400/5 rounded-full opacity-40 animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10 px-6 py-8">
        <Card className="bg-black/70 backdrop-blur-md border border-white/10 shadow-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/10">
              <Activity className="w-10 h-10 text-black" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                SportsFisio Pro
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Sistema integrado de performance esportiva e reabilitação
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-200 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="off"
                  placeholder="seuemail@email.com"
                  {...register("email")}
                  disabled={loading}
                  className="h-12 bg-gray-900/80 border border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/30"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-blue-400" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  {...register("password")}
                  disabled={loading}
                  className="h-12 bg-gray-900/80 border border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/30"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                {loading ? <Spinner /> : "Login"}
              </Button>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </form>

            <Separator className="my-6 bg-white/10" />

            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full h-11 text-white bg-gradient-to-r hover:from-blue-600 hover:to-green-600 transition-all duration-200 cursor-pointer"
                onClick={() => router.push("/register")}
              >
                <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                Criar nova conta
              </Button>

              <Button
                variant="ghost"
                className="w-full text-sm text-gray-400 bg-gradient-to-r hover:from-blue-600 hover:to-green-600 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                onClick={() => console.log("Redirect to forgot password")}
              >
                Esqueceu sua senha?
              </Button>
            </div>
          </CardContent>

          <CardFooter className="pt-6">
            <div className="w-full text-center">
              <p className="text-xs text-gray-500 mb-2">
                Plataforma desenvolvida por fisioterapeuta especializado
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span>Saúde</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span>Performance</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-400" />
                  <span>Tecnologia</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-3 gap-3 mt-6 px-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border border-white/10 ring-1 ring-white/5">
            <div className="text-lg font-bold text-blue-400">1.2K+</div>
            <div className="text-xs text-gray-400">Atletas</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border border-white/10 ring-1 ring-white/5">
            <div className="text-lg font-bold text-green-400">95%</div>
            <div className="text-xs text-gray-400">Recuperação</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border border-white/10 ring-1 ring-white/5">
            <div className="text-lg font-bold text-orange-400">24/7</div>
            <div className="text-xs text-gray-400">Suporte</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
