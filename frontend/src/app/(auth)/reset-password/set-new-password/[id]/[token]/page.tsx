import AuthFormLayout from "@/components/auth-form-layout";
import SetNewPasswordForm from "@/components/form/set-new-password"

const SetNewPasswordPage = ({ params }) => {
    return <article>
        <header className="text-white font-bold text-2xl text-center mb-4">Enter new password</header>
        <p className="text-white text-sm text-center mb-4 px-6 sm:px-2">Please enter your new password twice so we can verify you typed it in correctly.</p>
        <main>
            <AuthFormLayout>
                <SetNewPasswordForm id={params.id} token={params.token} />
            </AuthFormLayout>
        </main>
    </article>
}

export default SetNewPasswordPage;