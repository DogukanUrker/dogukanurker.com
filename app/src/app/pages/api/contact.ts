import type {NextApiRequest, NextApiResponse} from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {name, email, subject, message} = req.body

        // Here you can handle the form data, e.g., send an email or save to a database

        console.log({name, email, subject, message})

        res.status(200).json({message: "Message sent successfully"})
    } else {
        res.status(405).json({message: "Method not allowed"})
    }
}