const data = req.body; // request data body.
// Requester information
const requester = req.user;

//save request
const entity = await entities.dxpdemo_apprequest.insert({
    title: data.title,
    category: data.category,
    priority: data.priority,
    status: "Received",
    description: data.description,
    comments: data.comments,
    requester: requester.id,
});
//log.info(entity)

// Notify product team
const sendEmailToTeam = (teamEmail) =>
    sendEmail({
        to: teamEmail,
        subject: "A request for demo repurposing",
        from: "emmanuella.ndukwe@neptune-software.com",
        templateId: "EB9893B0-3AF7-EE11-AAF0-000D3AB82DC5",
        primitives: {
            title: data.title,
            category: data.category,
            priority: data.priority,
            status: "Received",
            description: data.description,
            comments: data.comments,
            requester: requester.email,
        },
    });
const teamMembersEmail = ["lloyd.trevarthen@neptune-software.com", "kaan.koska@neptune-software.com", "emmanuella.ndukwe@neptune-software.com", "cezar.strugariu@neptune-software.com"]
await Promise.allSettled(teamMembersEmail.map((email) => sendEmailToTeam(email)));

//Send email to Requester
const sendEmailToUser = (user) =>
    sendEmail({
        to: user.email,
        subject: "Your request for demo repurposing has been received!",
        from: "emmanuella.ndukwe@neptune-software.com",
        templateId: "FCBBEB90-11F7-EE11-AAF0-000D3AB82DC5",
        primitives: { username: user.name },
    });

sendEmailToUser(requester);

complete();
