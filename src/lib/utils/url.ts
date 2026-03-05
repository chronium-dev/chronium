/**
 * @name getSurveyPageFullUrl
 * @description Return the full URL to the survey page link. For example,
 * ratingsrobot.com/ratings/{SURVEY_CODE}
 * @param code
 */

import { env } from '$env/dynamic/public';

export function getSurveyPageFullUrl(code: string) {
	return [env.PUBLIC_APP_URL, 'rating', code].join('/');
}
