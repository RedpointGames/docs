import * as React from "react";
import '@kfiros/btoa-polyfill';

export default function KubernetesPullSecretGenerator() {
    const [username, setUsername] = React.useState<string>("");
    const [token, setToken] = React.useState<string>("");
    const [namespace, setNamespace] = React.useState<string>("");
    const [registryUrl, setRegistryUrl] = React.useState<string>("");

    const auth = btoa(`${username}:${token}`);
    const dockerConfig = `
{
    "auths": {
        "${registryUrl.trim() === '' ? 'https://registry.gitlab.com' : registryUrl}":{
            "username":"${username}",
            "password":"${token}",
            "email":"unused@example.com",
            "auth":"${auth}"
    	}
    }
}
`;
    const dockerConfigEncoded = btoa(dockerConfig.trim());
    const kubernetesSecret = `
apiVersion: v1
kind: Secret
metadata:
  name: gitlab
  namespace: ${namespace.trim() === '' ? 'default' : namespace}
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: ${dockerConfigEncoded}
`.trim();

    return <>
        <table style={{width: '100%', display: 'table'}}>
            <tr>
                <th style={{textAlign: 'left', width: '40%'}}>
                    GitLab deploy token username
                </th>
                <td>
                    <input className="input" style={{width: '100%'}} value={username} onChange={e => setUsername(e.target.value)} />
                </td>
            </tr>
            <tr>
                <th style={{textAlign: 'left'}}>
                    GitLab deploy token secret
                </th>
                <td>
                    <input className="input" style={{width: '100%'}} value={token} onChange={e => setToken(e.target.value)} />
                </td>
            </tr>
            <tr>
                <th style={{textAlign: 'left'}}>
                    GitLab registry URL
                </th>
                <td>
                    <input className="input" placeholder="https://registry.gitlab.com" style={{width: '100%'}} value={registryUrl} onChange={e => setRegistryUrl(e.target.value)} />
                </td>
            </tr>
            <tr>
                <th style={{textAlign: 'left'}}>
                    Kubernetes namespace
                </th>
                <td>
                    <input className="input" placeholder="default" style={{width: '100%'}} value={namespace} onChange={e => setNamespace(e.target.value)} />
                </td>
            </tr>
            <tr>
                <td colSpan={2}>
                    <textarea className="input" readOnly style={{ width: '100%' }} rows={15} value={kubernetesSecret}></textarea>
                    <p style={{marginBottom: '0', marginTop: '0.5em', fontSize: '80%'}}>
                        <strong>Important:</strong> Copy the contents of this text box and save it to a file like <code>pull-secret.yaml</code> on your local computer. You'll need this file every time you set up a new region / Kubernetes cluster. Anyone with this file can download your packaged game servers!
                    </p>
                </td>
            </tr>
        </table>
    </>;
}