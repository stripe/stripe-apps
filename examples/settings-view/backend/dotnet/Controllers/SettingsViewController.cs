using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Model;
using Stripe;
using dotenv.net;
using dotenv.net.Utilities;

namespace dotnet.Controllers;

[ApiController]
[Route("")]
public class SettingsViewController : ControllerBase
{
    public SettingsViewController() 
    {
        DotEnv.Load();
    }
    // This represents a database or other external infrastructure for
    // the purposes of this example. In a production system you would need
    // to set up a true persistent store.
    private static readonly List<SettingsView> Db = new()
    {

    };

    [HttpPost("api/settings")]
    public async Task<IActionResult> Index()
    {
        var body = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var jsonObject = JsonConvert.DeserializeObject<SettingsView>(body);

        var userPayload = new Dictionary<string, string?>();
        userPayload.Add("user_id", jsonObject?.User_id);
        userPayload.Add("account_id", jsonObject?.Account_id);

        var json = JsonConvert.SerializeObject(userPayload);

        StripeConfiguration.ApiKey = EnvReader.GetStringValue("STRIPE_API_KEY");

        try
        {
            EventUtility.ValidateSignature(
                json,
                Request.Headers["Stripe-Signature"],
                EnvReader.GetStringValue("APP_SECRET")
            );
        }
        catch (StripeException)
        {
            return BadRequest();
        }

        var accountData = new SettingsView()
        {
            User_id = jsonObject?.User_id,
            Account_id = jsonObject?.Account_id,
            Country = jsonObject?.Country,
            Language = jsonObject?.Language
        };

        Db.Add(accountData);


        return Ok();
    }

    [HttpGet("api/settings/{key}")]
    public ActionResult<SettingsView> Get(string key)
    {
        var userSettings = Db.Where(setting => setting.User_id == key).SingleOrDefault();

        if (userSettings is null)
        {
            return NotFound();
        }

        return userSettings;
    }
}
