var cc = DataStudioApp.createCommunityConnector();
var scriptProperties = PropertiesService.getScriptProperties();

function isAdminUser() {
  return true;
}

function getAuthType() {
  var AuthTypes = cc.AuthType;
  return cc
    .newAuthTypeResponse()
    .setAuthType(AuthTypes.NONE)
    .build();
}

function getConfig(request) {
  var config = cc.getConfig();

  config
    .newInfo()
    .setId('generalInfo')
    .setText('This is an example connector to showcase a connection to the Lumapps Data Lake.');

  return config.build();
}


var SERVICE_ACCOUNT_CREDS = 'SERVICE_ACCOUNT_CREDS';
var SERVICE_ACCOUNT_KEY = 'private_key';
var SERVICE_ACCOUNT_EMAIL = 'client_email';
var BILLING_PROJECT_ID = 'project_id';

/**
 * Copy the entire credentials JSON file from creating a service account in GCP.
 */
function getServiceAccountCreds() {
  return JSON.parse(scriptProperties.getProperty(SERVICE_ACCOUNT_CREDS));
}

function getOauthService() {
  var serviceAccountCreds = getServiceAccountCreds();
  var serviceAccountKey = serviceAccountCreds[SERVICE_ACCOUNT_KEY];
  var serviceAccountEmail = serviceAccountCreds[SERVICE_ACCOUNT_EMAIL];

  return OAuth2.createService('RowLevelSecurity')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setPrivateKey(serviceAccountKey)
    .setIssuer(serviceAccountEmail)
    .setPropertyStore(scriptProperties)
    .setCache(CacheService.getScriptCache())
    .setScope(['https://www.googleapis.com/auth/bigquery.readonly']);
}

var BASE_SQL =
  'SELECT c.id as ContentId, c.created_at, c.published_at, c.site.status as site_status, c.site.slug as site_slug, c.status as content_status,\
   da.date as PerformedOn, da.nb_content_comments, da.nb_content_likes, da.nb_content_views, da.user_id, \
  (SELECT value from unnest(c.title) where code="en") as content_title ,\
  (SELECT value from unnest(c.slug) where code="en") as content_slug,\
  (SELECT value from unnest(c.site.title) where code="en") as site_title,\
  (SELECT value from unnest(c.custom_content_type.name) where code="en") as content_type_name,\
  FROM `YOUR-PROD-PROJECT.external.dim_contents__ext` c \
  INNER JOIN `YOUR-PROD-PROJECT.external.fct_daily_user_content_activity__ext` da ON c.id=da.content_id';

function getQueryConfig(request) {
  var accessToken = getOauthService().getAccessToken();
  var serviceAccountCreds = getServiceAccountCreds();
  var billingProjectId = serviceAccountCreds[BILLING_PROJECT_ID];

  var bqTypes = DataStudioApp.createCommunityConnector().BigQueryParameterType;

  return cc
    .newBigQueryConfig()
    .setAccessToken(accessToken)
    .setBillingProjectId(billingProjectId)
    .setUseStandardSql(true)
    .setQuery(BASE_SQL)
    .build();
}

function getSchema(request) {
  return getQueryConfig(request);
}

function getData(request) {
  return getQueryConfig(request);
}