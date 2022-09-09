/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package stripe;

import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;

import spark.Request;
import spark.Response;

import static spark.Spark.port;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.options;
import static spark.Spark.before;

import io.github.cdimascio.dotenv.Dotenv;

public class App {
  private Gson gson = new Gson();

  class Settings {
  String country;
  String language;
  String user_id;
  String account_id;
  }

//  This Map represents a database or other external infrastructure for
// the purposes of this example. In a production system you would need
// to set up a true persistent store.
  private Map<String, Settings> db = new HashMap<String, Settings>();

  private String appSecret;

  public App(String getAppSecret) {
    appSecret = getAppSecret;
  }

  class User {
    String user_id;
    String account_id;
  }

  public Object getSettingsObject(Request request, Response response) {
    String key = request.params(":key");
    Settings userSetting = db.get(key);

    if (userSetting == null) {
      response.status(404);
      return "";
    } else {
      response.status(200);
      return gson.toJson(userSetting);
    }
  };

  public Object saveSettingsObject(Request request, Response response) {
    String sig = request.headers("Stripe-Signature");

    User userData = gson.fromJson(request.body(), User.class);
    String payload = gson.toJson(userData);

    try {
      Webhook.Signature.verifyHeader(payload, sig, appSecret, 300);
    } catch (SignatureVerificationException e) {
      response.status(400);
      return "";
    }

    Settings body = gson.fromJson(request.body(), Settings.class);
    db.put(body.user_id, body);

    response.status(200);
    return "";
  };

  public static void main(String[] args) {
    Dotenv dotenv = Dotenv.load();
    Stripe.apiKey = dotenv.get("STRIPE_API_KEY");
    port(8080);

    App app = new App(dotenv.get("APP_SECRET"));

    options("/*",
        (request, response) -> {

          String accessControlRequestHeaders = request
              .headers("Access-Control-Request-Headers");
          if (accessControlRequestHeaders != null) {
            response.header("Access-Control-Allow-Headers",
                accessControlRequestHeaders);
          }

          String accessControlRequestMethod = request
              .headers("Access-Control-Request-Method");
          if (accessControlRequestMethod != null) {
            response.header("Access-Control-Allow-Methods",
                accessControlRequestMethod);
          }

          return "OK";
        });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    get("/api/settings/:key", (req, res) -> app.getSettingsObject(req, res));
    post("/api/settings", (req, res) -> app.saveSettingsObject(req, res));
  }
}
