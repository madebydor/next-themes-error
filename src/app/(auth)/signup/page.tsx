import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "./signup";

const Signup = async () => {
	if (!globalGETRateLimit()) {
		return "Too many requests";
	}
	const { session } = await getCurrentSession();
	if (session !== null) {
		// if (!session.twoFactorVerified) {
		// 	return redirect("/2fa");
		// }
		return redirect("/");
	}
	return (
		<>
			<div className="flex flex-col items-center gap-2 text-center">
				<Avatar className="mb-4 flex h-12 w-12">
					<AvatarImage src={"/avatar.svg"} alt="Avatar" />
					<AvatarFallback className="rounded-none bg-gray-300 font-normal text-white"></AvatarFallback>
				</Avatar>
				<h1 className="text-3xl font-semibold">הרשמה למערכת</h1>
				<p className="text-balance text-muted-foreground">מלאו את פרטי ההתחברות שלמטה כדי להמשיך</p>
			</div>
			<SignUpForm />
			<div className="text-center text-sm">
				כבר יש לך משתמש?{` `}
				<Link href="/login" className={cn(buttonVariants({ variant: "link", size: "sm" }))}>
					התחבר כאן
				</Link>
			</div>
		</>
	);
};

export default Signup;
