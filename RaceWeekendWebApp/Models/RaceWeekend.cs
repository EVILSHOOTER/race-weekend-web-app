namespace RaceWeekendWebApp.Models
{
    public class RaceWeekend
    {
        // so this will contain all data pertaining to the weekend. it can also be saved as a pre-set, to a second database.

        public int Id { get; set; } // primary key. required.
        public string Name { get; set; }

        // tyre sets
        public int SoftTyreSets { get; set; }
        public int MediumTyreSets { get; set; }
        public int HardTyreSets { get; set; }

        // sessions - order matters.
        //public List<string> Sessions { get; set; } 
        public string Sessions { get; set; }

        // race session at end. bother representing? or append automatically? 
        // it's not part of the calculations, so ignore? just present visually

        // returns
        public int FreeReturnTyreSets { get; set; }
        public int QualifyingReturnTyreSets { get; set; }

        public string JSONSessionData { get; set; }


        public RaceWeekend() // this will be used by other part of code, but can be used to initialise values.
        {
            // set normal/default race weekend stats.
            // check if this overwrites the values entered by the user using post.

            Name = "Race weekend";

            HardTyreSets = 2;
            MediumTyreSets = 3;
            SoftTyreSets = 8;

            //Sessions = new List<string>() { "Free Session", "Free Session", "Free Session", "Qualifying" }; // we can count the duplicate sessions
            Sessions = "1112"; // rather simplistic workaround for now. 1 = FP, 2 = Q.
                               // creating a new table just to hold session order is not preferable. 
                               // esp. since sessions hold no properties. only order and amount matters for the race weekend.
                               // instead, each character represents a session. and the order is there.

            FreeReturnTyreSets = 2;
            QualifyingReturnTyreSets = 1;

            JSONSessionData = ""; // this is strictly for completion's sake in the MVP. in a second agile iteration, I can make this into its own table.
        }



        // clamp the values when entered, so no more/less can be inputted. have a separate JS one saved for this too btw.
        // clamp function?

    }
}
