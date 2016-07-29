﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Configuration;
using System.Collections.Generic;

namespace Vdp
{
    [TestClass]
    public class ManageCommunitiesTest
    {
        private AbstractVisaAPIClient abstractVisaAPIClient;

        public ManageCommunitiesTest()
        {
            abstractVisaAPIClient = new AbstractVisaAPIClient();
        }

        [TestMethod]
        public void TestGetCommunities()
        {
            string baseUri = "vta/";
            string resourcePath = "v3/communities";
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("ServiceId", ConfigurationManager.AppSettings["vtaServiceId"]);
            string status = abstractVisaAPIClient.DoMutualAuthCall(baseUri + resourcePath, "GET", "Get Communities Test", "", headers);
            Assert.AreEqual(status, "OK");
        }
    }
}
