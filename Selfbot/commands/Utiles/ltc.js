module.exports = {
   name: "ltc",
   premium: true,
   run: async (client, message, args) => {
      switch(args[0]) {
         default:
            if (!client.db.payments.ltc)
            {
               message.edit(client.language(
                  `*Aucune adresse ltc définie.*`,
                  `*No ltc adress defined.*`
               ));
            } else if (client.db.payments.ltc)
            {
               message.edit(`*Ltc :* \`${client.db.payments.ltc}\``);
            }
            break;

         case "add":
            if (!args[1]) return message.edit(client.language(
               `*Veuillez fournir une adresse ltc.*`,
               `*Please give an ltc address.*`
            ));

            client.db.payments.paypal = args[1];
            client.save();
            message.edit(client.language(
               `*Votre adresse ltc a été ajoutée.*`,
               `*Your ltc address has been added.*`
            ));
            break;
         
         case "remove":
            client.db.payments.ltc = null;
            client.save();
            message.edit(client.language(
               `*Votre adresse ltc a été supprimée.*`,
               `*Your ltc address has been removed.*`
            ));
            break;
      }
   }
}