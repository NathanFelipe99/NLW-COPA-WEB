import IHomeProps from "./interfaces/IHomeProps";
import { FormEvent, useState } from "react";
import Image from "next/image";

import appImagePreview from "../assets/app-nlw-copa-preview.png";
import logoImage from "../assets/logo.svg";
import avatarsImage from "../assets/users-avatar-example.png";
import iconCheck from "../assets/icon-check.svg";
import { wApi } from "../lib/axios";

export default function Home(pProps: IHomeProps) {
    const [wPoolTitle, setPoolTitle] = useState("");
    
    async function fCreatePool(pEvent: FormEvent) {
        pEvent.preventDefault();    

        try {
            const wResponse = await wApi.post("/pools", {
                anTitulo: wPoolTitle
            });

            const { caBolao } = wResponse["data"];

            await navigator.clipboard.writeText(caBolao);
            
            alert("Bolão criado com sucesso! O código foi copiado para a área de transferência!");

            setPoolTitle("");
        } catch (pErr) {
            console.log("Erro:", pErr);
            alert("Falha ao criar o bolão, tente novamente");
        }
    }

    return (
        <div className="max-w-[1124px] my-10 mx-auto grid grid-cols-2 items-center gap-28">
            <main>
                <Image src={logoImage} alt="Logo NLW" quality={100} />
                <h1 className="mt-10 text-white text-5xl font-bold leading-tight">
                    Crie seu próprio bolão da Copa e compartilhe entre amigos!
                </h1>

                <div className="mt-10 flex items-center gap-2">
                    <Image src={avatarsImage} alt="Usuários que já criaram seus bolões" quality={100} />
                    <strong className="text-gray-100 text-xl">
                        <span className="text-ignite-500">+{pProps["userCount"]}</span> pessoas já estão usando
                    </strong>
                </div>

                <form onSubmit={fCreatePool} className="mt-10 flex gap-2 ">
                    <input value={wPoolTitle} onChange={pEvent => setPoolTitle(pEvent.target.value)} className="flex-1 px-6 py-4 rouded bg-gray-800 border border-gray-600 text-sm text-gray-100" type="text" required placeholder="Qual o nome do seu bolão?" />
                    <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700" type="submit" >Criar meu bolão</button>
                </form>

                <p className="text-sm text-gray-300 mt-4 leading-relaxed">Após criar o seu bolão, você receberá um código único para convidar seus amigos</p>

                <div className="mt-6 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
                    <div className="flex items-center gap-6">
                        <Image src={iconCheck} alt="" />
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">+{pProps["poolCount"]}</span>
                            <span>Bolões Criados</span>
                        </div>
                    </div>
                    <div className="w-px h-14 bg-gray-600"/>
                    <div className="flex items-center gap-6">
                        <Image src={iconCheck} alt="" />
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">+{pProps["guessCount"]}</span>
                            <span>Palpites Criados</span>
                        </div>
                    </div>
                </div>
            </main>
            <Image src={appImagePreview} alt="Celulares exibindo a prévia do App" quality={100} />
        </div>
    )
}

export const getServerSideProps = async () => {

    const [ wPoolCountResponse, wGuessesCountResponse, wUsersCountReponse ] = await Promise.all([
        wApi.get("/pools/count"),
        wApi.get("/guesses/count"),
        wApi.get("/users/count")
    ]);
    return {
        props: {
            poolCount: wPoolCountResponse["data"]["pools"],
            guessCount: wGuessesCountResponse["data"]["guesses"],
            userCount: wUsersCountReponse["data"]["users"]
        }
    };
}
