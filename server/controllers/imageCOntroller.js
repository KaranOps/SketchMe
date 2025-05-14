import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            res.json({ success: false, message: "Missing Details" })
        }

        if (userModel.creditBalance === 0 || userModel.creditBalance < 0) {
            res.json({ success: false, message: "No credit balance", creditBalance: user.creditBalance })
        }
        
        //1. Create a new form to send data
        const formData = new FormData()
        // 2. Add the prompt to the form
        fromData.append('prompt', prompt)
        

        // 3. Make a POST request to ClipDrop API
        const { data } = await axios.post('https://clipdrop-api.co/cleanup/v1', formData, {
            headers: {
                'x-api-key': CLIPDROP_API,
            },
            responseType: 'arraybuffer',
        })

        // 4. Convert binary image to base64
        const base64Image = Buffer.from(data,'binary').toString('base64')

        // 5. Prepare the final image for the browser
        const resultImage = `data:image/png;base64,${base64Image}`

        // 6. Update user's credit balance
        await userModel.findByIdAndUpdate(user._id, {
            creditBalance: user.creditBalance - 1
        })
        
        // 7. Send the result back to the frontend    
        res.json({success:true, message: "Image Generated", creditBalance: user.creditBalance-1, resultImage})
    } catch (error) {

    }
}