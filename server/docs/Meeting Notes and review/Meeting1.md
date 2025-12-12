# Summary:
In today's meeting we setup and planned a rough outline of what the project will be for the next few weeks as well as confirmed with the teacher that our idea aligns with what he wants for this project.

It was decided that text communications will be the main form of contact, and utilizing the canvas groups for file sharing and recource managing would be used (subject to change to perhaps github)

Tuesdays at 12:15 will be the regularly scheduled meeting time for the project and will consist of minumum 15minutes. Extended time and collaboration of the different layer team meetings can be arranged based on individual schedules.

# Timeline for the project:
It was said for the timeline to be as follows:
Research and finalizing looks: 17th-21rst
    Goals: 
        **Presentation layer** *(Dannika with assistance from Amandaleeanne)*: Finish the figma prototyping to come out with a solid MVP that everyone else can use to start working on the code.
        **Application layer** *(David, Joel)*: Figure out what API to use, get aquainted with the API enough to know how to query it, figure out and rouhly design what get,post, put and delete will do for the controllers and how that will interact with the client and database.
        Data Layer *(Amandaleeanne)*: Setup an AWS and test a database connection in order to be ready to recieve and store models. Brainstorm what models might be needed 

Implementation (November 22nd - December 4th):
    Goals:
        **Presentation layer** (Dannika): have the Client side of the WebApp fully implemented based on the figma design.
        **Applicaiton layer** *(David, Joel)*: Complete implementation of the server by receving client side interaction requests, setting up handlers, and implementing the API calls needed to interact with the API and database
        **Database Layer** *(Amandaleeanne)* : Implement the models and security to manage database connections and requests

Polish/Bug-squashing (December 4th - December 11th):
    Goals:
    Make sure that everything runs together smoothly and all parts are done. This section is also for any time lapse that may ocurr due to life happening.


# Extra notes:
The teacher mentioned that we should have a Minimum Viable Product that meets the requirements of the assignment, but it should be very simple and straightforward. Once we have the small MVP implemented, it is then that we can start expanding if we so wish.

He also mentioned that we should not worry about docker and a container for now.

For having MVC, he mentioned that we will need to seperate out what the client and what the server does. An example might be that you have controllers in your server that will handle requests and makes requests for a weekly summery from the database when a button is clicked on the client (webpage).


He really stressed to keep the MVC architecture in the front of mind and being mindful of the sever to handle the data, but mentioned that the CRUD and RESTful mendsets will simply be a fucntion of the applicaiton anyways, so it is okay not to keep that in the front of the mind too much.

AS for how the project will Authenticate a user and control acsess to thier private data (secure endpoints) it is still unknown but the research and database team can collaborate on that during the research phase and after the Secrity lecture is done.

Database layer:
Stores user data and any past records and newly created records
a food model that has a food name and caloric value and then you have a meal model that has lots of little food objects in it that would be a "complex" model though it is not mandatory to have, it is an idea.