using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PropTaxApp
{
    public partial class frmMain : Form
    {
        bool runInBg = true;
        public frmMain()
        {
            InitializeComponent();
            mnExit.Click += MnExit_Click;
            mnSettings.Click += MnSettings_Click;
            ntfTray.DoubleClick += MnSettings_Click; ;
        }

        private void MnSettings_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Normal;
        }

        private void MnExit_Click(object sender, EventArgs e)
        {
            runInBg = false;
            this.Close();
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            runInBg = true;
            this.Close();
        }

        private void frmMain_Load(object sender, EventArgs e)
        {

        }

        private void frmMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
            e.Cancel = runInBg;
        }
    }
}
