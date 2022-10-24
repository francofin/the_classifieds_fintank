import queryString from 'query-string';
import {nanoid} from 'nanoid';
import stripe from 'stripe';
import { DjangoAuthContext } from '@context/authContext';


const stripeInit = stripe(process.env.NEXT_PUBLIC_STRIPE_KEY);


export const makeVendorController = async(req, res) => {

    //Find user, if user does not have stripe account id, create new. save user stripe account id in the database. 
    //Create account link based on account id for front end to complete onbairding. 
    //Prefill optional information
    //Send URL response to front end. 
    //send account link as json to front end. 
    const user = req.body;

    try{
        // const user = await User.findById(req.user._id).exec();
        if(!user.stripe_account_id){
            const account = await stripeInit.accounts.create({type:"express"})
            console.log("Stripe Account Object", account);
            user.stripe_account_id = account.id;
            user.save();
        }
    
        let accountLink = await stripeInit.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type:'account_onboarding'
        });
    
        
    
        accountLink = Object.assign(accountLink, {
            "stripe_user[email]":user.email,
        });

        console.log(accountLink);
    
        res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    } catch(err){
        console.log("Create Vendor Server Error", err)
    }

}