import { loginSchema, type LoginValues } from "@/schemas/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  onSubmit: (values: LoginValues) => void;
};

export default function LoginForm({ onSubmit }: Props) {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginSchema.parse({
      password: "",
    }),
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input placeholder="user@example.com" {...form.register("email")} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          {...form.register("password")}
        />
      </div>
      <Button className="w-full" type="submit">
        Log In
      </Button>
    </form>
  );
}
