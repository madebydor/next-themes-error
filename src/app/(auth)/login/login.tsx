"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { loginAction } from "./actions";

export default function LoginForm() {
	const { toast } = useToast();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: ""
		}
	});

	async function onSubmit(values: z.output<typeof loginSchema>) {
		const result = await loginAction(values);
		if (result.user !== null) {
			toast({
				title: "התחברות בוצעה בהצלחה",
				description: `welcome.`
			});
		} else {
			toast({
				title: "שגיאה בהתחברות",
				description: result.message,
				variant: "destructive"
			});
		}
	}
	return (
		<div className="flex w-full flex-col gap-4 py-1">
			<div className="relative flex flex-col items-center gap-4">
				<span className="relative z-20 bg-white px-2 text-sm text-secondary-foreground">או</span>
				<div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-border" />
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>שם משתמש</FormLabel>
										<FormControl>
											<Input placeholder="m@example.com" autoComplete="off" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>סיסמא</FormLabel>
										<FormControl>
											<Input type="password" autoComplete="off" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col gap-3">
							<Button type="submit">התחברות</Button>
							<Link href="/signup" className={cn(buttonVariants({ variant: "link" }))}>
								אין לך משתמש? הרשם כאן
							</Link>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
