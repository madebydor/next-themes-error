"use client";

import ButtonGoogle from "@/app/(auth)/_components/button-google";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { schema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signupAction } from "./actions";

export const SignUpForm = ({ companyId }: { companyId?: string }) => {
	const { toast } = useToast();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			username: "",
			password: "",
			companyId: companyId || ""
		}
	});

	async function onSubmit(values: z.output<typeof schema>) {
		const result = await signupAction(values);
		if (result.user !== undefined) {
			toast({
				title: "החשבון נוצר בהצלחה",
				description: `ברוכים הבאים!!`
			});
		} else {
			toast({
				title: "שגיאה בהרשמה",
				description: result.message,
				variant: "destructive"
			});
		}
	}
	return (
		<div className="flex w-full flex-col gap-4 py-1">
			<ButtonGoogle />
			<div className="relative flex flex-col items-center gap-4">
				<span className="relative z-20 bg-white px-2 text-sm text-secondary-foreground">או</span>
				<div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-border" />
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>שם</FormLabel>
									<FormControl>
										<Input autoComplete="off" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>שם משתמש</FormLabel>
									<FormControl>
										<Input placeholder="you@example.com" autoComplete="off" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>סיסמא</FormLabel>
									<FormControl>
										<Input type="password" placeholder="" autoComplete="new-password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-col gap-3">
							<Button type="submit">הרשם</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};
